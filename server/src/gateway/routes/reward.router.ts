import { Router } from "express";
import * as RewardController from "../controllers/reward.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/redeem",
  authMiddleware,
  RewardController.redeemRewards
);

router.get(
  "/history",
  authMiddleware,
  RewardController.getMyRewardHistory
);

router.get(
  "/all",
  RewardController.getAllRewards
)

export default router;
