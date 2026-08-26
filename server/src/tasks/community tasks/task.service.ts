import { prisma } from "../../lib/prisma"
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import { TaskStatus, TaskCompletionStatus, TaskType, UserStatus, UserRole } from "@prisma/client"
import { CreateCommunityTaskInput } from "./community-task.validation";
// Get Task by ID.

export interface GetTaskParams {
  communityTaskId: string;
  userId?: string;
}

//gets the id from communityTask model
export const taskById = async ({ communityTaskId, userId }: GetTaskParams) => {
  const communityTask = await prisma.communityTask.findUnique({
    where: { id: communityTaskId },
    include: {
      task: true,
      registrations: true,
      ngo: { select: { id: true, name: true } },
      area: { select: { id: true, name: true } },
    },
  });

  if (!communityTask) throw new ApiError(404, "Community task not found");

  const userRegistration = userId
    ? communityTask.registrations.find((r) => r.userId === userId)
    : null;

  const registeredCount = communityTask.registrations.length;
  const isFull = communityTask.maxParticipants
    ? registeredCount >= communityTask.maxParticipants
    : false;

  return {
    communityTaskId: communityTask.id,
    taskId: communityTask.task.id,
    title: communityTask.task.title,
    description: communityTask.task.description,
    baseScore: communityTask.task.baseScore,
    startAt: communityTask.task.startAt?.toISOString(),
    endAt: communityTask.task.endAt?.toISOString(),
    isActive: communityTask.task.isActive,
    locationName: communityTask.locationName,
    latitude: communityTask.latitude,
    longitude: communityTask.longitude,
    radiusMeters: communityTask.radiusMeters,
    maxParticipants: communityTask.maxParticipants,
    minParticipants: communityTask.minParticipants,
    registeredCount,
    isFull,
    isRegistered: !!userRegistration,
    registrationStatus: userRegistration?.status ?? null,
    ngoName: communityTask.ngo.name,
    areaName: communityTask.area.name,
  };
};
// All Available Tasks.

export const availableTasks = async (areaId?: string) => {
  const now = new Date();

  const tasks = await prisma.communityTask.findMany({
    where: {
      task: {
        isActive: true,
        OR: [{ endAt: null }, { endAt: { gte: now } }], // Shows ongoing and upcoming
      },
      ...(areaId ? { areaId } : {}),
    },
    include: {
      task: true,
      registrations: { select: { id: true } },
    },
    orderBy: { task: { startAt: "asc" } },
  });

  return {
    items: tasks.map((ct) => ({
      communityTaskId: ct.id,
      taskId: ct.task.id,
      title: ct.task.title,
      description: ct.task.description,
      baseScore: ct.task.baseScore,
      locationName: ct.locationName,
      startAt: ct.task.startAt?.toISOString(),
      endAt: ct.task.endAt?.toISOString(),
      maxParticipants: ct.maxParticipants,
      registeredCount: ct.registrations.length,
      isFull: ct.maxParticipants ? ct.registrations.length >= ct.maxParticipants : false,
    })),
  };
};

// Register User for Task.

export interface RegisterTaskParams {
  taskId: string
  userId: string
}

// Update this function after ngo is added to the schema.
export const registerTask = async ({ taskId, userId }: RegisterTaskParams) => {

  return prisma.$transaction(async (tx) => {

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        areaId: true,
        status: true
      }
    });

    if (!user) throw new ApiError(404, "User not found");

    if (user.status !== UserStatus.ACTIVE) {
      throw new ApiError(403, "Your account is inactive.");
    }

    if (!user.areaId) {
      throw new ApiError(
        400,
        "Please select your area before registering."
      );
    }


    const now = new Date()

    // Fetch community task + parent task.
    const communityTask = await tx.communityTask.findUnique({
      where: { id: taskId },
      include: { task: true }
    })

    if (!communityTask) throw new ApiError(404, "Community task not found");

    if (user.areaId !== communityTask.areaId) {
      throw new ApiError(
        403,
        "You are not eligible for this community task."
      );
    }
    if (!communityTask) throw new Error("Task not found")
    if (!communityTask.task.isActive) throw new Error("Task is not active")

    if (communityTask.task.startAt && now < communityTask.task.startAt)
      throw new Error("Task has not started yet")

    if (communityTask.task.endAt && now > communityTask.task.endAt)
      throw new Error("Task has expired")

    // Prevent duplicate registration.
    const existingRegistration = await tx.communityTaskRegistration.findUnique({
      where: { taskId_userId: { taskId, userId } }
    })
    if (existingRegistration) throw new ApiError(409, "Already registered")

    // Participation count check.
    if (communityTask.maxParticipants !== null) {
      const registrationsCount = await tx.communityTaskRegistration.count({
        where: { taskId }
      })
      if (registrationsCount >= communityTask.maxParticipants) throw new Error("Task registration is full")
    }

    // Create Registration
    await tx.communityTaskRegistration.create({
      data: {
        taskId: taskId,
        userId: userId,
        status: TaskStatus.REGISTERED
      }
    })

    // Create TaskScore.
    const taskScore = await tx.taskScore.create({
      data: {
        userId: userId,
        taskId: communityTask.taskId,
        baseScore: communityTask.task.baseScore,
        status: TaskCompletionStatus.STARTED,
        performanceScore: 0
      }
    })

    return {
      taskScoreId: taskScore.id,
      status: taskScore.status
    }
  })
}

// Get User’s Tasks.

export interface UserTasksParams {
  userId: string
}

export const userTasks = async ({ userId }: UserTasksParams) => {

  const taskScores = await prisma.taskScore.findMany({
    where: { userId },
    include: {
      task: {
        include: {
          communityTask: true
        }
      }
    },
    // Order the TaskScores by the creation date of the related Task
    orderBy: {
      task: {
        createdAt: "desc"
      }
    }
  })

  return taskScores.map(ts => ({
    taskId: ts.task.id,
    communityTaskId: ts.task.communityTask?.id,
    title: ts.task.title,
    status: ts.status,
    baseScore: ts.baseScore,
    performanceScore: ts.performanceScore
  }))
}

//Instead of include we can use select to reduce payload

// export const userTasks = async ({ userId }: UserTasksParams) => {
//   const taskScores = await prisma.taskScore.findMany({
//     where: { userId },
//     select: {
//       status: true,
//       baseScore: true,
//       performanceScore: true,
//       task: {
//         select: {
//           id: true,
//           title: true,
//           communityTask: {
//             select: { id: true }
//           }
//         }
//       }
//     },
//     orderBy: {
//       task: { createdAt: "desc" }
//     }
//   });

//   return taskScores.map(ts => ({
//     taskId: ts.task.id,
//     communityTaskId: ts.task.communityTask?.id,
//     title: ts.task.title,
//     status: ts.status,
//     baseScore: ts.baseScore,
//     performanceScore: ts.performanceScore
//   }));
// };



export const createCommunityTask = async (data: CreateCommunityTaskInput, userRole: UserRole) => {
  if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
    const ngo = await prisma.nGO.findUnique({
      where: { id: data.ngoId },
      select: { areaId: true },
    });

    if (!ngo) {
      throw new Error("NGO not found.");
    }

    if (ngo.areaId !== data.areaId) {
      throw new Error(
        "Forbidden: You can only create tasks within your NGO's designated area."
      );
    }
  }

  // 2. Database Transaction
  // Ensures both records are created simultaneously to maintain referential integrity
  const result = await prisma.$transaction(async (tx) => {

    // Create the base Task record
    const task = await tx.task.create({
      data: {
        type: "COMMUNITY",
        title: data.title,
        description: data.description,
        baseScore: data.baseScore,
        startAt: data.startAt ? new Date(data.startAt) : null,
        endAt: data.endAt ? new Date(data.endAt) : null,
        isActive: true,
      },
    });

    // Create the linked CommunityTask record
    const communityTask = await tx.communityTask.create({
      data: {
        taskId: task.id,
        maxParticipants: data.maxParticipants ?? null,
        minParticipants: data.minParticipants ?? null,
        locationName: data.locationName ?? null,

        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        radiusMeters: data.radiusMeters ?? 100,

        ngoId: data.ngoId,
        areaId: data.areaId,
      },
    });

    return { ...task, communityDetails: communityTask };
  });

  return result;
}