
import { Request, Response } from "express";
// import { loginUser } from "../../core-backend/auth/auth.service";

/**
 * POST /api/auth/login
 */
// export const login = async (req: Request, res: Response) => {
//   try {
//     const result = await loginUser(req.body);
//     return res.status(200).json(result);
//   } catch (error: any) {
//     return res.status(error.status || 500).json({
//       message: error.message || "Login failed",
//     });
//   }
// };

// Dummy placeholders for now
export const login = async (_req: Request, res: Response) => {
  return res.status(501).json({ message: "Signup not implemented yet" });
};

export const signup = async (_req: Request, res: Response) => {
  return res.status(501).json({ message: "Signup not implemented yet" });
};

export const verifyOtp = async (_req: Request, res: Response) => {
  return res.status(501).json({ message: "OTP verification not implemented yet" });
};
