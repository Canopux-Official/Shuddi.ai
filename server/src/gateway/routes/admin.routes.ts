import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {requireRole} from "../middleware/rbac.middleware";
import { createTask, deactiveteTask, getMyPermission, getSearchTasks, moderateNGOApplication,
     moderateNGOStatus, reactivateTask, getDeactivatedTasks, createReward, deleteReward, getPlatformStatsController,
     getActiveNGOsController, getNGOMembersController, reactivateMemberController, suspendMemberController
    } from "../controllers/admin.controller";

const router = Router();

router.get(
  "/tasks/deactivated",
  authMiddleware,
  requireRole(["SUPER_ADMIN", "ADMIN"]),
  getDeactivatedTasks
);

router.get(
  "/tasks",
  authMiddleware,
  requireRole(["SUPER_ADMIN", "ADMIN"]),
  getSearchTasks
);

router.post(
  "/tasks",
  authMiddleware,
  requireRole(["SUPER_ADMIN", "ADMIN"]),
  createTask
);

router.post(
  "/rewards",
  authMiddleware,
  requireRole(["SUPER_ADMIN", "ADMIN"]),
  createReward
);

router.delete(
  "/rewards/:id",
  authMiddleware,
  requireRole(["SUPER_ADMIN", "ADMIN"]),
  deleteReward
);

router.patch(
  "/tasks/:id/deactivate",
  authMiddleware,
  requireRole(["SUPER_ADMIN", "ADMIN"]),
  deactiveteTask
);

router.patch(
  "/tasks/:id/reactivate",
  authMiddleware,
  requireRole(["SUPER_ADMIN", "ADMIN"]),
  reactivateTask
);

router.get(
  "/permissions",
  authMiddleware,
  requireRole(["SUPER_ADMIN"]),
  getMyPermission
);

router.patch(
  "/applications/:id/status",
  authMiddleware,
  requireRole(["SUPER_ADMIN"]),
  moderateNGOApplication
);

router.patch(
  "/ngos/:id/status",
  authMiddleware,
  requireRole(["SUPER_ADMIN"]),
  moderateNGOStatus
);

router.get("/stats", authMiddleware, requireRole(["SUPER_ADMIN"]), getPlatformStatsController);

router.get("/ngos/active", authMiddleware, requireRole(["SUPER_ADMIN"]), getActiveNGOsController);

router.get("/ngos/:ngoId/members", authMiddleware, requireRole(["SUPER_ADMIN"]), getNGOMembersController);

router.patch("/members/:memberId/suspend", authMiddleware, requireRole(["SUPER_ADMIN"]), suspendMemberController);

router.patch("/members/:memberId/reactivate", authMiddleware, requireRole(["SUPER_ADMIN"]), reactivateMemberController);

export default router;
