import { Request, Response } from "express";
import * as RewardOrchestrator from "../services/reward.orchestrator";
import { asyncHandler } from "../utils/asyncHandler";

export const redeemRewards = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { amount, rewardName } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid redemption amount" });
  }

  const result = await RewardOrchestrator.redeemRewards(
    userId,
    rewardName,
    Number(amount)
  );

  res.json({
    status: "SUCCESS",
    redemption: result.redemption,
    newBalance: result.newBalance,
  });
};

export const getMyRewardHistory = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const history = await RewardOrchestrator.getMyRewardHistory(userId);

  res.json({
    items: history,
  });
};

export const getAllRewards = asyncHandler(async (req: Request, res: Response) => {
  const rewards = await RewardOrchestrator.getAllRewards();
  res.json(rewards)
})
