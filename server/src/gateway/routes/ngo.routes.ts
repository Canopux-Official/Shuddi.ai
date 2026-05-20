import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import { applyForNGOController, createAreaController, getAreasController, getNGOModerationDataController, fetchNGODetails,

} from "../controllers/ngo.controller";

const router = Router();


router.get("/areas", getAreasController);

router.get("/moderation", authMiddleware, requireRole(["SUPER_ADMIN"]), getNGOModerationDataController);

router.get("/:ngoId/details", authMiddleware, requireRole(["SUPER_ADMIN"]), fetchNGODetails);
// POST /ngo/apply
router.post("/apply", authMiddleware, applyForNGOController);

router.post("/areas", authMiddleware, requireRole(["SUPER_ADMIN"]), createAreaController);

export default router;