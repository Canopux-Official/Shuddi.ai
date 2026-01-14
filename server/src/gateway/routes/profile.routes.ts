import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getMyProfileController,
  createProfileController,
  updateProfileController,
  deleteProfileController,
  suggestNamesController,
} from "../controllers/profile.controller";

const router = Router();

// GET    /profile/me
// POST   /profile
// PUT    /profile
// DELETE /profile
// GET    /profile/suggest-names

// Get logged-in user's profile
router.get("/me", authMiddleware, getMyProfileController);

//Only create, update and delete profile routes not tested
// Create profile (first-time onboarding)
router.post("/", authMiddleware, createProfileController);

// Update profile
router.put("/", authMiddleware, updateProfileController);

// Delete profile
router.delete("/", authMiddleware, deleteProfileController);

// Username suggestions (public)
router.get("/suggest-names", suggestNamesController);

export default router;
