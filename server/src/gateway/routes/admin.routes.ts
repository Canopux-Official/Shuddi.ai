import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {requireRole} from "../middleware/rbac.middleware";
import { createTask, deactiveteTask, getMyPermission, getSearchTasks, moderateNGOApplication,
     moderateNGOStatus, reactivateTask, getDeactivatedTasks, createReward, deleteReward
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


export default router;
