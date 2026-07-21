import { prisma } from "../../lib/prisma"
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import { TaskStatus, TaskCompletionStatus, TaskType, UserStatus } from "@prisma/client"
// Get Task by ID.

export interface GetTaskParams {
  communityTaskId: string
}

export interface CreateCommunityTaskDto {
  title: string;
  description: string;
  baseScore: number;
  startAt?: string;
  endAt?: string;
  minParticipants?: number;
  maxParticipants?: number;
  locationName?: string;
}

//gets the id from communityTask model
export const taskById = async ({ communityTaskId }: GetTaskParams) => {

  const communityTask = await prisma.communityTask.findUnique({
    where: { id: communityTaskId },
    include: { task: true, registrations: true }
  })
  if (!communityTask) throw new Error("Community task not found")

  return {
    communityTaskId: communityTask.id,
    taskId: communityTask.task.id,
    title: communityTask.task.title,
    description: communityTask.task.description,
    baseScore: communityTask.task.baseScore,
    startAt: communityTask.task.startAt?.toISOString(),
    endAt: communityTask.task.endAt?.toISOString(),
    isActive: communityTask.task.isActive,
    maxParticipants: communityTask.maxParticipants,
    registeredCount: communityTask.registrations.length
  }
}
// All Available Tasks.

export const availableTasks = async () => {

  const now = new Date()

  const tasks = await prisma.communityTask.findMany({
    where: { task: { isActive: true, startAt: { lte: now }, endAt: { gte: now } } },
    include: { task: true },
    orderBy: { task: { startAt: "asc" } }
  })

  return {
    items: tasks.map(ct => ({
      communityTaskId: ct.id,
      taskId: ct.task.id,
      title: ct.task.title,
      description: ct.task.description,
      startAt: ct.task.startAt?.toISOString(),
      endAt: ct.task.endAt?.toISOString(),
      maxParticipants: ct.maxParticipants
    }))
  }
}

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



export const createCommunityTask = async (userId: string, dto: CreateCommunityTaskDto) => {
  const membership = await prisma.nGOMember.findFirst({
    where: {
      userId,
      status: "ACTIVE"
    },
    include: {
      ngo: true
    }
  })

  if (!membership || !membership.ngo) {
    throw new ApiError(403, "User is not an active member of any NGO");
  }

  const ngo = membership.ngo;

  if (dto.baseScore <= 0)
    throw new ApiError(400, "Base score must be positive.");

  if (
    dto.minParticipants &&
    dto.maxParticipants &&
    dto.minParticipants > dto.maxParticipants
  )
    throw new ApiError(400, "Minimum participants cannot exceed maximum participants.");

  if (
    dto.startAt &&
    dto.endAt &&
    new Date(dto.startAt) >= new Date(dto.endAt)
  )
    throw new ApiError(400, "End time must be after start time.");

  const task = await prisma.task.create({
    data: {
      type: TaskType.COMMUNITY,
      title: dto.title,
      description: dto.description,
      baseScore: dto.baseScore,
      startAt: dto.startAt ? new Date(dto.startAt) : null,
      endAt: dto.endAt ? new Date(dto.endAt) : null,

      communityTask: {
        create: {
          ngoId: ngo.id,
          areaId: ngo.areaId,
          locationName: dto.locationName,
          minParticipants: dto.minParticipants,
          maxParticipants: dto.maxParticipants,
        },
      },
    },
    include: {
      communityTask: true,
    },
  });
  return task;
}