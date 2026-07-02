import { Router } from "express";
import * as TaskController from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import * as CommunityTaskController from "../controllers/community-task.controller";

const router = Router();

//Need to create a task history api.

//individual tasks
// /api/tasks/..
router.get("/all", authMiddleware, TaskController.getAllTasks);
router.get("/daily", authMiddleware, TaskController.getDailyTasks);
router.get("/:taskId", authMiddleware, TaskController.getTaskDetails);
router.post("/:taskId/start", authMiddleware, TaskController.startTask);
router.get("/:taskId/status", authMiddleware, TaskController.getStatus);
router.post("/:taskId/submit", authMiddleware, TaskController.submitTask);

//community events
// /api/tasks/...
router.get(
  "/community/tasks/all",
  CommunityTaskController.getAvailableTasks
);

router.get(
  "/community/:communityTaskId",
  authMiddleware,
  CommunityTaskController.getTaskDetails
);

router.post(
  "/community/:communityTaskId/register",
  authMiddleware,
  CommunityTaskController.registerTask
);


router.get(
  "/community/my",
  authMiddleware,
  CommunityTaskController.myTasks
);

//simulate flow
router.post("/community/:communityTaskId/verify", authMiddleware, CommunityTaskController.communityParticipation)

export default router;
