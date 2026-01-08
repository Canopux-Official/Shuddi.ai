import { Request, Response } from "express";

/**
 * GET /api/profile/me
 */
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    // req.user is attached by authMiddleware
    const user = req.user!;

    // TEMP: replace with core-backend call later
    const profile = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: "Mock User",
    };

    return res.status(200).json(profile);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

/**
 * PUT /api/profile/me
 */
export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const payload = req.body;

    // TEMP: replace with core-backend call later
    const updatedProfile = {
      ...payload,
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json(updatedProfile);
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to update profile",
    });
  }
};
