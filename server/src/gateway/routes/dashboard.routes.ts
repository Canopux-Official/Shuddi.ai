import { Router } from "express";
import {
  getOverviewController,
  getImpactController,
  getBadgesController,
  getActivityController,
  getLeaderboardController,
} from "../controllers/dashboard.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

/**
 * DASHBOARD ROUTES
 * Base path: /dashboard
 */

router.get("/overview", authMiddleware, getOverviewController);

router.get("/impact", authMiddleware, getImpactController);

router.get("/badges", authMiddleware, getBadgesController);

router.get("/activity", authMiddleware, getActivityController);

router.get("/leaderboard", authMiddleware, getLeaderboardController);

export default router;
