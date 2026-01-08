import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getDashboard } from "../controllers/dashboard.controller";

const router = Router();

// Get dashboard data for logged-in user
router.get("/", authMiddleware, getDashboard);

export default router;
