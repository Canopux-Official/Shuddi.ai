import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import {
  Difficulty,
  TaskCategory,
  TaskType,
  TaskVerificationType,
} from "@prisma/client";
import { generateRubric, toPythonType } from "../../gateway/services/verification-client.service";

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

  if (type === "INDIVIDUAL" && !verificationType) {
    throw new ApiError(400, "Verification type is required");
  }

  if (
    type === "INDIVIDUAL" &&
    !Object.values(TaskVerificationType).includes(verificationType)
  ) {
    throw new ApiError(400, "Invalid verification type");
  }

  const resolvedVerificationType: TaskVerificationType | undefined =
    type === "INDIVIDUAL" ? (verificationType as TaskVerificationType) : undefined;

  // Generate the verification rubric up front, outside the DB transaction,
  // since it's a network/LLM call (verification-api's /rubric/generate,
  // backed by Gemini) and shouldn't hold a Postgres transaction open.
  //
  // MCQ tasks never go through the LLM verification pipeline, so they
  // don't get a generated prompt.
  let generatedPrompt: string | undefined;

  if (
    type === "INDIVIDUAL" &&
    resolvedVerificationType &&
    resolvedVerificationType !== "MCQ"
  ) {
    try {
      const rubric = await generateRubric(
        title,
        description,
        toPythonType(resolvedVerificationType)
      );
      generatedPrompt = rubric.criteria_text;
    } catch (err: any) {
      throw new ApiError(
        502,
        `Failed to generate verification rubric: ${err?.message ?? "verification-api unreachable"}`
      );
    }
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

          verificationType: resolvedVerificationType as TaskVerificationType,

          isDaily: isDaily ?? false,
          cooldownDays,
          taskDuration,
          requirements,
          educationalLink,
          factContent,
          prompt: generatedPrompt,
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