import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import { CreateRewardInput } from "../../validation/reward.validation";

export const createRewardService = async (data: CreateRewardInput) => {
    const reward = await prisma.reward.create({
        data,
    });

    return reward;
};

export const deleteRewardService = async (
  rewardId: string
) => {
  const reward = await prisma.reward.findUnique({
    where: {
      id: rewardId,
    },
  });

  if (!reward) {
    throw new ApiError(404, "Reward not found");
  }

  await prisma.reward.delete({
    where: {
      id: rewardId,
    },
  });

  return {
    message: "Reward deleted successfully",
  };
};