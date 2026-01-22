import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getFeed,
  createPost,
} from "../controllers/feed.controller";

const router = Router();

// Get feed for logged-in user
router.get("/", authMiddleware, getFeed);

// Create a new post (optional for phase-1, but common)
router.post("/", authMiddleware, createPost);

export default router;
