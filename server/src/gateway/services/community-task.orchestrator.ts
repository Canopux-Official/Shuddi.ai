import * as CommunityTaskService from "../../tasks/community tasks/task.service";
import { prisma } from "../../lib/prisma";
import { TaskCompletionStatus, TaskStatus, UserRole } from "@prisma/client";
import { triggerRewardFlow } from "./reward.orchestrator";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import {CreateCommunityTaskInput} from "../../tasks/community tasks/community-task.validation";
// import { z } from "zod";



export const getCommunityTaskDetails = async (
  communityTaskId: string, userId: string
) => {
  return CommunityTaskService.taskById({ communityTaskId, userId });
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
export const completeCommunityParticipation = async (
  communityTaskId: string, 
  userId: string,
  stars: number = 5, // Accepts 1-5 from the controller
  source: string = "NGO_MANUAL"
) => {
  // Convert 5-star scale to 100-point scale (e.g., 4 stars * 20 = 80 points)
  const scoreOutOf100 = stars * 20;

  // Execute atomic database updates inside a transaction
  const { taskScoreId } = await prisma.$transaction(async (tx) => {
    // 1. Resolve base task ID and check current status
    const registration = await tx.communityTaskRegistration.findUnique({
      where: { taskId_userId: { taskId: communityTaskId, userId } },
      include: { task: true }
    });

    if (!registration) throw new ApiError(404, "Registration not found");

    // 🔥 RACE CONDITION GUARD: If already verified, abort to prevent duplicate rewards
    if (registration.status === TaskStatus.COMPLETED) {
       throw new ApiError(400, "Participant has already been verified.");
    }

    // 2. Finalize Registration Status
    await tx.communityTaskRegistration.update({
      where: { id: registration.id },
      data: {
        status: TaskStatus.COMPLETED,
        completionConfirmed: true,
        reviewedAt: new Date(),
      },
    });

    // 3. Retrieve Active TaskScore
    const activeTaskScore = await tx.taskScore.findFirst({
      where: {
        userId,
        taskId: registration.task.taskId,
        status: {
          in: [
            TaskCompletionStatus.STARTED, 
            TaskCompletionStatus.UNDER_VERIFICATION
          ]
        },
      },
    });

    if (!activeTaskScore) {
        throw new ApiError(404, "Active task score not found");
    }

    // 4. Mutate Ledger with calculated score
    const updatedScore = await tx.taskScore.update({
      where: { id: activeTaskScore.id },
      data: {
        status: TaskCompletionStatus.VERIFIED,
        performanceScore: scoreOutOf100, 
        verificationSource: source,
        verifiedAt: new Date(),
      },
    });

    return { taskScoreId: updatedScore.id };
  });

  // 5. Trigger the reward flow OUTSIDE the transaction
  // This prevents holding database locks while the reward orchestrator does its work
  await triggerRewardFlow(taskScoreId);

  return {
    taskScoreId,
    status: "COMPLETED",
  };
}

export const getUserCommunityTasks = async (userId: string) => {
  return CommunityTaskService.userTasks({ userId });
};

export const createCommunityTask = async (data: CreateCommunityTaskInput, userRole: UserRole) => {
  // Validate input data
  const newTask = await CommunityTaskService.createCommunityTask(data, userRole);
  return newTask;
};
