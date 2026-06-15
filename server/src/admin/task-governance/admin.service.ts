import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import {
  Difficulty,
  TaskCategory,
  TaskType,
  TaskVerificationType,
} from "@prisma/client";

interface GetTasksParams {
    search?: string;
    type?: TaskType;
    isActive?: boolean;
    page: number;
    limit: number;
}

export const getAllTasksService = async ({
  search,
  type,
  isActive,
  page,
  limit,
}: GetTasksParams) => {
  const whereClause: any = {
    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...(type && {
      type: type as TaskType,
    }),

    ...(isActive !== undefined && {
      isActive,
    }),
  };

  const [tasks, totalTasks] = await Promise.all([
    prisma.task.findMany({
      where: whereClause,

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        individualTask: true,
        communityTask: true,
      },
    }),

    prisma.task.count({
      where: whereClause,
    }),
  ]);

  return {
    tasks,

    pagination: {
      currentPage: page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
    },
  };
};

export const createTaskService = async (body: any) => {
  const {
    type,

    title,
    description,
    baseScore,
    isActive,
    startAt,
    endAt,

    // Individual task fields
    difficulty,
    category,
    verificationType,
    isDaily,
    cooldownDays,
    taskDuration,
    requirements,
    educationalLink,
    factContent,

    // Community task fields
    maxParticipants,
    minParticipants,
    locationName,
    
    ngoId,
    areaId,
  } = body;

  if (!type || !Object.values(TaskType).includes(type)) {
    throw new ApiError(400, "Invalid task type");
  }

  if (!title || !description || !baseScore) {
    throw new ApiError(400, "Missing required task fields");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Create base task
    const task = await tx.task.create({
      data: {
        type,
        title,
        description,
        baseScore,
        isActive: isActive ?? true,
        startAt,
        endAt,
      },
    });

    // INDIVIDUAL TASK
    if (type === "INDIVIDUAL") {
      if (!verificationType) {
        throw new ApiError(400, "Verification type is required");
      }

      await tx.individualTask.create({
        data: {
          taskId: task.id,

          difficulty:
            difficulty && Object.values(Difficulty).includes(difficulty)
              ? difficulty
              : "EASY",

          category:
            category && Object.values(TaskCategory).includes(category)
              ? category
              : "SUSTAINABILITY",

          verificationType:
            verificationType as TaskVerificationType,

          isDaily: isDaily ?? false,
          cooldownDays,
          taskDuration,
          requirements,
          educationalLink,
          factContent,
        },
      });
    }

    // COMMUNITY TASK
    if (type === "COMMUNITY") {
      await tx.communityTask.create({
        data: {
          taskId: task.id,

          maxParticipants,
          minParticipants,
          locationName,
          
          ngoId,
          areaId,
        },
      });
    }

    return await tx.task.findUnique({
      where: {
        id: task.id,
      },

      include: {
        individualTask: true,
        communityTask: true,
      },
    });
  });

  return result;
};

export const deactivateTaskService = async (taskId: string) => {
  const existingTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      isActive: false,
    },
  });

  return updatedTask;
};

// admin.service.ts

interface GetDeactivatedTasksParams {
  search?: string;
  page: number;
  limit: number;
}

export const getDeactivatedTasksService = async ({
  search,
  page,
  limit,
}: GetDeactivatedTasksParams) => {
  const whereClause: any = {
    isActive: false,

    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const [tasks, totalTasks] = await Promise.all([
    prisma.task.findMany({
      where: whereClause,

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        updatedAt: "desc",
      },

      include: {
        individualTask: true,
        communityTask: true,
      },
    }),

    prisma.task.count({
      where: whereClause,
    }),
  ]);

  return {
    tasks,

    pagination: {
      currentPage: page,
      limit,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
    },
  };
};

// admin.service.ts

export const reactivateTaskService = async (
  taskId: string
) => {
  const existingTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  if (existingTask.isActive) {
    throw new ApiError(400, "Task is already active");
  }

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      isActive: true,
    },

    include: {
      individualTask: true,
      communityTask: true,
    },
  });

  return updatedTask;
};