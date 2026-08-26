import { Router } from "express";
import {
  registerController,
  verifyOtpController,
  loginController,
  googleAuthController,
  resendOtpController,
  onboardController,
  createPasswordController,
  getPermissionsController,
} from "../controllers/auth.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Email + Password signup
router.post("/register", registerController);

// Email OTP verification
router.post("/verify-otp", verifyOtpController);

// Email + Password login
router.post("/login", loginController);

// Google login / signup
router.post("/google", googleAuthController);

// Resend email OTP
router.post("/resend-otp", resendOtpController);

// User onboarding (JWT protected)
router.post("/onboard", authMiddleware, onboardController);

router.patch("/create-password", authMiddleware, createPasswordController);

router.get("/permissions", authMiddleware, getPermissionsController);

export default router;
