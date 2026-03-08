import * as CommunityTaskService from "../../tasks/community tasks/task.service";
import { prisma } from "../../lib/prisma";
import { TaskCompletionStatus, TaskStatus } from "@prisma/client";
import { triggerRewardFlow } from "./reward.orchestrator";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

export const getCommunityTaskDetails = async (
  communityTaskId: string
) => {
  return CommunityTaskService.taskById({ communityTaskId });
};

export const getAvailableCommunityTasks = async () => {
  return CommunityTaskService.availableTasks();
};

//will return taskScore id after register
export const registerForCommunityTask = async (
  communityTaskId: string,
  userId: string
) => {
  /**
   * This only registers + creates taskScore.
   * Verification & reward will come later.
   */
  return CommunityTaskService.registerTask({
    taskId: communityTaskId,
    userId
  });
};

// POST /api/internal/community-tasks/:taskId/verify
//why is it a post api?
export const completeCommunityParticipation = async (communityTaskId: string, userId: string) => {


  const communityTask = await prisma.communityTask.findUnique({
    where: { id: communityTaskId },
  });

  if (!communityTask) throw new ApiError(404, "Community task not found");

  await prisma.communityTaskRegistration.update({
    where: { taskId_userId: { taskId: communityTaskId, userId } },
    data: {
      status: TaskStatus.COMPLETED,
      completionConfirmed: true,
      reviewedAt: new Date(),
    },
  });

  const taskScore = await prisma.taskScore.update({
    where: { userId_taskId: { userId, taskId: communityTask.taskId } },
    data: { 
      status: TaskCompletionStatus.VERIFIED,
      performanceScore: 100,
      verificationSource: "NGO",
      verifiedAt: new Date(),
     },
  });

  await triggerRewardFlow(taskScore.id);

  return {
    taskScoreId: taskScore.id,
    status: "COMPLETED",
  };
}

export const getUserCommunityTasks = async (userId: string) => {
  return CommunityTaskService.userTasks({ userId });
};

