import { prisma } from "../../../lib/prisma";
import { SubmissionStatus, TaskCompletionStatus } from "@prisma/client";

export const getTaskById = async (taskId: string, userId: string) => {
  return await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      individualTask: {
        include: {
          submissions: {
            where: { userId },
            take: 1,
          },
        },
      },
      communityTask: true,
    },
  });
};

//Getting all individual tasks which have/don't have cooldown, daily task will have another logic.
export const getAvailableIndividualTasks = async (userId: string) => {
  const now = new Date();

  const tasks = await prisma.task.findMany({
    where: {
      individualTask: {
        is: {
          isDaily: false,
        },
      },
      isActive: true,
      OR: [
        { startAt: null },
        { startAt: { lte: now } },
      ],
      AND: [
        {
          OR: [
            { endAt: null },
            { endAt: { gte: now } },
          ],
        },
      ],
    },
    include: {
      individualTask: {
        include: {
          submissions: {
            where: {
              userId,
            },
            orderBy: {
              submittedAt: "desc",
            },
            take: 1,
          },
        },
      },
    },
  });


  const filteredTasks = tasks.filter((task) => {
    const cooldown = task.individualTask?.cooldownDays;
    const lastSubmission = task.individualTask?.submissions?.[0];

    // ❌ Hide if active
    if (
      lastSubmission &&
      ["STARTED", "SUBMITTED"].includes(lastSubmission.status)
    ) {
      return false;
    }

    // ✅ Never attempted
    if (!lastSubmission) return true;

    // ✅ One-time task
    if (cooldown == null) return false;

    // ✅ Allow retry if not approved (rejected etc)
    if (lastSubmission.status !== "APPROVED") {
      return true;
    }

    // ✅ Cooldown logic
    const lastTime =
      lastSubmission.verifiedAt || lastSubmission.submittedAt;

    const nextAvailable = new Date(lastTime);
    nextAvailable.setDate(nextAvailable.getDate() + cooldown);

    return now >= nextAvailable;
  });

  return filteredTasks;
};


export const findActiveSubmission = async (taskId: string, userId: string) => {
  const individualTask = await prisma.individualTask.findUnique({
    where: { taskId },
  });

  if (!individualTask) return null;

  return await prisma.taskSubmission.findFirst({
    where: {
      userId,
      taskId: individualTask.id,
    },
  });
};


export const createSubmission = async (taskId: string, userId: string) => {

  const individualTask = await prisma.individualTask.findUnique({
    where: { taskId },
    include: { task: true }
  });

  if (!individualTask) {
    throw new Error("This task does not support individual submissions.");
  }

  return prisma.$transaction(async (tx) => {

    const taskSubmission = await tx.taskSubmission.create({
      data: {
        userId,
        taskId: individualTask.id,
        status: "STARTED",
      },
    });

    const taskScore = await tx.taskScore.create({
      data: {
        userId: userId,
        taskId: individualTask.taskId,
        baseScore: individualTask.task.baseScore,
        status: TaskCompletionStatus.STARTED,
        performanceScore: 0,
      },
    });

    return {
      submission: taskSubmission,
      taskScore: taskScore
    };

  });
};

export const updateSubmissionEvidence = async (
  submissionId: string,
  data: {
    evidenceUrls?: string[];
    textResponse?: string;
    mcqAnswer?: string;
  }
) => {
  return await prisma.taskSubmission.update({
    where: { id: submissionId },
    data: {
      ...data,
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });
};