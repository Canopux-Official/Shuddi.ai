import { Router } from "express";
import {
  login,
  signup,
  verifyOtp,
} from "../controllers/auth.controller";

const router = Router();

// Login
router.post("/login", login);

// Signup
router.post("/signup", signup);

// OTP verification
router.post("/verify-otp", verifyOtp);

export default router;
