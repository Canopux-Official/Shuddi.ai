import { prisma } from "../../../lib/prisma";

export const getTaskById = async (taskId: string, userId: string) => {
  return await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      submissions: {
        where: { userId },
        take: 1,
      },
    },
  });
};

export const findActiveSubmission = async (taskId: string, userId: string) => {
  return await prisma.taskSubmission.findUnique({
    where: {
      userId_taskId: {
        userId,
        taskId,
      },
    },
  });
};

export const createSubmission = async (taskId: string, userId: string) => {
  return await prisma.taskSubmission.create({
    data: {
      userId,
      taskId,
      status: "STARTED",
    },
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