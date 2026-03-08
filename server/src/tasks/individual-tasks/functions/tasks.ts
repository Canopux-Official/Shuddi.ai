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


export const findActiveSubmission = async (taskId: string, userId: string) => {
  const individualTask = await prisma.individualTask.findUnique({
    where: { taskId },
  });

  if (!individualTask) return null;

  return await prisma.taskSubmission.findUnique({
    where: {
      userId_taskId: {
        userId,
        taskId: individualTask.id, 
      },
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