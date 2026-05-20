import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {requireRole} from "../middleware/rbac.middleware";
import { getMyPermission, moderateNGOApplication, moderateNGOStatus } from "../controllers/admin.controller";

const router = Router();

router.get("/permissions", authMiddleware, requireRole(["SUPER_ADMIN"]), getMyPermission);
router.patch("/applications/:id/status", authMiddleware, requireRole(["SUPER_ADMIN"]), moderateNGOApplication);
router.patch("/ngos/:id/status", authMiddleware, requireRole(["SUPER_ADMIN"]), moderateNGOStatus);

export default router;
