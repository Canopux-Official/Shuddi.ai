import { Request, Response } from "express";
import * as RewardOrchestrator from "../services/reward.orchestrator";

export const redeemRewards = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid redemption amount" });
  }

  const result = await RewardOrchestrator.redeemRewards(
    userId,
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
