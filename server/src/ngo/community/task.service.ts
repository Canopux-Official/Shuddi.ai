import prisma from "../../lib/prisma";
import { getNGOContext } from "../utils/getNGOContext";

export class NgoTaskService {
  /**
   * Fetches community tasks for a specific NGO based on a timeline.
   * Utilizes cursor pagination to prevent frontend bottlenecks.
   */
  async getTasksByTimeline(
    ngoId: string,
    timeline: "upcoming" | "ongoing" | "past",
    limit: number,
    cursor?: string
  ) {
    const now = new Date();
    let timelineFilter: any = {};

    // Filter logic based on the Task model's startAt and endAt dates
    switch (timeline) {
      case "upcoming":
        timelineFilter = { task: { startAt: { gt: now } } };
        break;
      case "ongoing":
        timelineFilter = { task: { startAt: { lte: now }, endAt: { gte: now } } };
        break;
      case "past":
        timelineFilter = { task: { endAt: { lt: now } } };
        break;
    }

    const tasks = await prisma.communityTask.findMany({
      take: limit + 1, // Fetch one extra to determine if there's a next page
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      where: {
        ngoId,
        ...timelineFilter,
      },
      select: {
        id: true, // CommunityTask ID
        taskId: true, // Base Task ID
        locationName: true,
        task: {
          select: {
            title: true,
            startAt: true,
            endAt: true,
          },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: {
        task: { startAt: "asc" }, // Ascending order for timeline chronology
      },
    });

    let nextCursor: string | null = null;
    if (tasks.length > limit) {
      const nextItem = tasks.pop(); // Remove the extra item
      nextCursor = nextItem!.id;
    }

    // Flatten the payload slightly for the frontend
    const formattedData = tasks.map((ct) => ({
      id: ct.id,
      taskId: ct.taskId,
      title: ct.task.title,
      startAt: ct.task.startAt,
      endAt: ct.task.endAt,
      locationName: ct.locationName,
      totalRegistrations: ct._count.registrations,
    }));

    return { data: formattedData, meta: { nextCursor, hasNextPage: !!nextCursor } };
  }

  /**
   * Fetches lightweight task details and aggregate registration stats.
   */
  async getTaskDetailsWithStats(communityTaskId: string, ngoId: string) {
    // 1. Fetch Task Details
    const taskDetails = await prisma.communityTask.findUnique({
      where: { id: communityTaskId, ngoId },
      include: {
        task: {
          select: {
            title: true,
            description: true,
            startAt: true,
            endAt: true,
          },
        },
      },
    });

    if (!taskDetails) throw new Error("Task not found or access denied.");

    // 2. Fetch Aggregated Stats dynamically using PostgreSQL groupBy
    const statusCounts = await prisma.communityTaskRegistration.groupBy({
      by: ["status"],
      where: { taskId: communityTaskId },
      _count: { status: true },
    });

    // 3. Format stats into a clean key-value object (e.g., { COMPLETED: 12, REGISTERED: 3 })
    const stats = statusCounts.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);

    return {
      id: taskDetails.id,
      title: taskDetails.task.title,
      description: taskDetails.task.description,
      startAt: taskDetails.task.startAt,
      endAt: taskDetails.task.endAt,
      locationName: taskDetails.locationName,
      latitude: taskDetails.latitude,
      longitude: taskDetails.longitude,
      radiusMeters: taskDetails.radiusMeters,
      stats,
    };
  }

  /**
   * Fetches the participants list for a specific community task.
   * Enforces NGO ownership and supports status filtering + cursor pagination.
   */
  async getTaskParticipants(
    taskId: string, 
    ngoId: string, 
    limit: number, 
    status?: string, 
    cursor?: string
  ) {
    // 1. Verify the task belongs to this NGO to prevent unauthorized access
    const taskExists = await prisma.communityTask.findUnique({
      where: { id: taskId, ngoId: ngoId }
    });

    if (!taskExists) {
      throw new Error("Task not found or access denied.");
    }

    // 2. Build the query payload
    const whereClause = {
      taskId: taskId,
      ...(status && { status: status as any }), // Cast to TaskStatus enum
    };

    // 3. Fetch data with cursor pagination and relational includes
    const [participants, totalCount] = await Promise.all([
      prisma.communityTaskRegistration.findMany({
        take: limit + 1,
        ...(cursor && {
          skip: 1,
          cursor: { id: cursor }
        }),
        where: whereClause,
        select: {
          id: true,
          userId: true,
          status: true,
          checkInTime: true,
          user: {
            select: {
              profile: {
                select: {
                  displayName: true,
                  avatarUrl: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'asc' // Oldest registrations appear first
        }
      }),
      prisma.communityTaskRegistration.count({ where: whereClause }) // Get total for UI context
    ]);

    // 4. Resolve pagination cursor
    let nextCursor: string | null = null;
    if (participants.length > limit) {
      const nextItem = participants.pop();
      nextCursor = nextItem!.id;
    }

    // 5. Format payload for the frontend
    const formattedData = participants.map(p => ({
      registrationId: p.id,
      userId: p.userId,
      status: p.status,
      checkInTime: p.checkInTime,
      displayName: p.user.profile?.displayName || "Unknown Citizen",
      avatarUrl: p.user.profile?.avatarUrl || null,
    }));

    return { 
      data: formattedData, 
      meta: { 
        nextCursor, 
        hasNextPage: !!nextCursor,
        totalParticipants: totalCount 
      } 
    };
  }

  /**
   * Finalizes the event, marks it as inactive, and rejects no-shows.
   */
  async finalizeEvent(communityTaskId: string, ngoId: string) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validate ownership and get the base task ID
      const communityTask = await tx.communityTask.findUnique({
        where: { id: communityTaskId, ngoId },
        include: { task: true }
      });

      if (!communityTask) {
        throw new Error("Community task not found or access denied.");
      }

      // 2. Close the event from the discovery feed
      await tx.task.update({
        where: { id: communityTask.taskId },
        data: { isActive: false }
      });

      // 3. Find all users who are NOT completed or already rejected
      const pendingRegistrations = await tx.communityTaskRegistration.findMany({
        where: {
          taskId: communityTaskId,
          status: { in: ["REGISTERED", "UNDER_VERIFICATION"] }
        },
        select: { userId: true }
      });

      const userIds = pendingRegistrations.map(r => r.userId);

      if (userIds.length > 0) {
        // 4. Reject the registrations and add the reason
        await tx.communityTaskRegistration.updateMany({
          where: { 
            taskId: communityTaskId, 
            userId: { in: userIds } 
          },
          data: {
            status: "REJECTED",
            supervisorNote: "Did not attend the event.",
            reviewedAt: new Date()
          }
        });

        // 5. Reject the active TaskScores
        await tx.taskScore.updateMany({
          where: {
            taskId: communityTask.taskId,
            userId: { in: userIds },
            status: { in: ["STARTED", "UNDER_VERIFICATION"] }
          },
          data: {
            status: "REJECTED",
            performanceScore: 0,
            verificationSource: "SYSTEM_SWEEP",
            verifiedAt: new Date()
          }
        });
      }

      return { 
        message: "Event ended successfully.", 
        rejectedCount: userIds.length 
      };
    });
  }
}

