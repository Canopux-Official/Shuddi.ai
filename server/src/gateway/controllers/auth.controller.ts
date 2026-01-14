import { Request, Response } from "express";
import { AuthService } from "../../core-backend/auth/services/auth.service";

/**
 * Email + Password Registration
 */
export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await AuthService.registerUser(email, password);

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * Verify Email OTP
 */
export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const result = await AuthService.verifyUserOtp(email, otp);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * Email + Password Login
 */
export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await AuthService.authenticateUser(email, password);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

/**
 * Google Login / Signup
 */
export const googleAuthController = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Google ID token is required" });
    }

    const result = await AuthService.handleGoogleAuth(idToken);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

/**
 * Resend Email OTP
 */
export const resendOtpController = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await AuthService.resendUserOtp(email);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * User Onboarding (Protected)
 */
export const onboardController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user?.id;
    const { username, country, state, city } = req.body;

    if (!username || !country || !state || !city) {
      return res.status(400).json({ message: "All onboarding fields are required" });
    }

    const result = await AuthService.onboardUser(userId, {
      username,
      country,
      state,
      city,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
