import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import { requireNGOMembership } from "../middleware/requireNGOMembership";
import { applyForNGOController, createAreaController, getAreasController, getNGOModerationDataController,
    fetchNGODetails, getNGODashboardController, inviteMemberController, getNGORolesController,
    getMembersController, removeMemberController, suspendMemberController

} from "../controllers/ngo.controller";
import { requireNGOPermission } from "../middleware/requireNGOPermission";

const router = Router();


router.get("/areas", getAreasController);

router.get("/moderation", authMiddleware, requireRole(["SUPER_ADMIN"]), getNGOModerationDataController);

router.get("/dashboard", authMiddleware, requireNGOMembership, getNGODashboardController);

router.get("/roles", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), getNGORolesController);

router.get("/members", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), getMembersController);

router.get("/:ngoId/details", authMiddleware, requireRole(["SUPER_ADMIN"]), fetchNGODetails);
// POST /ngo/apply
router.post("/apply", authMiddleware, applyForNGOController);

router.post("/areas", authMiddleware, requireRole(["SUPER_ADMIN"]), createAreaController);

router.post("/members/invite", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), inviteMemberController);

router.patch("/members/:memberId/suspend", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), suspendMemberController);

router.delete("/members/:memberId", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), removeMemberController);



export default router;