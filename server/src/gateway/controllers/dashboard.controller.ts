import { Request, Response } from "express";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const dashboardData = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      stats: {
        notifications: 3,
        tasks: 5,
      },
      message: "Mock dashboard data",
    };

    return res.status(200).json(dashboardData);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch dashboard data",
    });
  }
};
