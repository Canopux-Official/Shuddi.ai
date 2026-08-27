import { Router } from "express";
import * as TaskController from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import {requireRole} from "../middleware/rbac.middleware";
import {requireNGOMembership} from "../middleware/requireNGOMembership";
import * as CommunityTaskController from "../controllers/community-task.controller";
import { requirePermission } from "../middleware/requirePermission";

const router = Router();

//Need to create a task history api.

// 1. COMMUNITY EVENTS (Specific routes first)
router.get("/community/all", CommunityTaskController.getAvailableTasks);
router.get("/community/my", authMiddleware, CommunityTaskController.myTasks);
router.get("/community/:communityTaskId", authMiddleware, CommunityTaskController.getTaskDetails);
router.post("/community/:communityTaskId/register", authMiddleware, CommunityTaskController.registerTask);
router.post("/community", authMiddleware, requireNGOMembership, requirePermission("CREATE_COMMUNITY_TASK"), CommunityTaskController.createCommunityTask);
router.post("/community/:communityTaskId/verify", authMiddleware, CommunityTaskController.communityParticipation);
router.post("/community/:taskId/check-in", authMiddleware, CommunityTaskController.checkIn);
router.post("/community/:taskId/verify-participant/:userId", authMiddleware, CommunityTaskController.verifyParticipant);

// 2. INDIVIDUAL TASKS (Dynamic routes last)
router.get("/all", authMiddleware, TaskController.getAllTasks);
router.get("/daily", authMiddleware, TaskController.getDailyTasks);
router.get("/:taskId", authMiddleware, TaskController.getTaskDetails); 
router.post("/:taskId/start", authMiddleware, TaskController.startTask);
router.get("/:taskId/status", authMiddleware, TaskController.getStatus);
router.post("/:taskId/submit", authMiddleware, TaskController.submitTask);
export default router;
