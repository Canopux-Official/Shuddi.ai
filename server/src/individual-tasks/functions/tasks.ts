import { prisma } from "../../../lib/prisma";
import { SubmissionStatus } from "@prisma/client";

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
      // We include community details just in case, though this function focuses on individual
      communityTask: true, 
    },
  });
};


export const findActiveSubmission = async (taskId: string, userId: string) => {
  // 1. Get the IndividualTask ID associated with this parent Task ID
  const individualTask = await prisma.individualTask.findUnique({
    where: { taskId },
  });

  if (!individualTask) return null;

  // 2. Find the submission using the IndividualTask ID
  return await prisma.taskSubmission.findUnique({
    where: {
      userId_taskId: {
        userId,
        taskId: individualTask.id, // Must use IndividualTask ID here
      },
    },
  });
};

export const createSubmission = async (taskId: string, userId: string) => {
  const individualTask = await prisma.individualTask.findUnique({
    where: { taskId },
  });

  if (!individualTask) {
    throw new Error("This task does not support individual submissions.");
  }

  return await prisma.taskSubmission.create({
    data: {
      userId,
      taskId: individualTask.id, // Linking to IndividualTask
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