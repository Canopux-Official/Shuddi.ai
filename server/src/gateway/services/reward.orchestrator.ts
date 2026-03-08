import prisma from "../../lib/prisma";
import { TaskCompletionStatus } from "@prisma/client";
import {
  processRedemptionEntry,
  getUserRewardHistory,
  creditTaskReward 
} from "../../reward/services/reward.service";

/**
 * Redeem user rewards
 * Called by frontend
 */
export const redeemRewards = async (
  userId: string,
  amount: number
) => {
  return prisma.$transaction(async (tx) => {
    return processRedemptionEntry(tx, userId, amount);
  });
};

/**
 * Get reward history for logged-in user
 * Called by frontend
 */
export const getMyRewardHistory = async (userId: string) => {
  return getUserRewardHistory(userId);
};

export const triggerRewardFlow = async (
  taskScoreId: string
) => {
  // Move to REWARD_PROCESSING
  await prisma.taskScore.update({
    where: { id: taskScoreId },
    data: { status: TaskCompletionStatus.REWARD_PROCESSING },
  });

  // Credit reward
  const result = await creditTaskReward(taskScoreId);

  return result;
};