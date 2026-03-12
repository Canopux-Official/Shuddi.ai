import { Request, Response } from "express";
import * as DashboardService from "../../core-backend/dashboard/services/dashboard.services";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * Dashboard Overview (core stats)
 */
export const getOverviewController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const stats = await DashboardService.getCoreStats(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Dashboard overview fetched successfully.",
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview.",
      data: null,
    });
  }
};

/**
 * Impact data
 */
export const getImpactController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const impact = await DashboardService.getImpactData(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Impact data fetched successfully.",
      data: impact,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch impact data.",
      data: null,
    });
  }
};

/**
 * User badges
 */
export const getBadgesController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const badges = await DashboardService.getUserBadges(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Badges fetched successfully.",
      data: badges,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch badges.",
      data: null,
    });
  }
};

/**
 * Activity graph
 */
export const getActivityController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const activity = await DashboardService.getActivityGraph(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Activity data fetched successfully.",
      data: activity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity data.",
      data: null,
    });
  }
};

/**
 * Leaderboard
 */
export const getLeaderboardController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const type = (req.query.type as "global" | "regional") || "global";

    const leaderboard = await DashboardService.getLeaderboard(
      req.user.id,
      type
    );

    return res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully.",
      data: leaderboard,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard.",
      data: null,
    });
  }
};

export const getBalance = asyncHandler(async(req: Request, res: Response) => {
  const userId = req.user.id
  const data = await DashboardService.getCredit(userId);
  res.json(data);
})
