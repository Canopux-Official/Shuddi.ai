import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profile.controller";

const router = Router();

// Get logged-in user's profile
router.get("/me", authMiddleware, getMyProfile);

// Update logged-in user's profile
router.put("/me", authMiddleware, updateMyProfile);

export default router;
