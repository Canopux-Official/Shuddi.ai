import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";
import { requireNGOMembership } from "../middleware/requireNGOMembership";
import { applyForNGOController, createAreaController, getAreasController, getNGOModerationDataController,
    fetchNGODetails, getNGODashboardController, inviteMemberController, getNGORolesController,
    getMembersController, removeMemberController, suspendMemberController, getNgoInvitationsController,
    acceptInvitationController, rejectInvitationController,
    getMyInvitationsController, reactivateMemberController,
    getTasks,
    getTaskDetails,
    endEvent,
    getParticipants,
    verifyParticipantController

} from "../controllers/ngo.controller";
import { requireNGOPermission } from "../middleware/requireNGOPermission";

const router = Router();


router.get("/areas", getAreasController);

router.get("/moderation", authMiddleware, requireRole(["SUPER_ADMIN"]), getNGOModerationDataController);

router.get("/dashboard", authMiddleware, requireNGOMembership, getNGODashboardController);

router.get("/roles", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), getNGORolesController);

router.get("/members", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), getMembersController);

router.get("/invitations/me", authMiddleware, getMyInvitationsController);
    
router.get("/:ngoId/tasks", authMiddleware, requireNGOMembership, requireNGOPermission("VIEW_ANALYTICS"), getTasks);

router.get("/:ngoId/tasks/:taskId", authMiddleware, requireNGOMembership, requireNGOPermission("VIEW_ANALYTICS"), getTaskDetails);

router.get("/:ngoId/tasks/:taskId/participants", authMiddleware, requireNGOMembership, requireNGOPermission("REVIEW_SUBMISSIONS"), getParticipants);

router.patch("/:invitationId/accept", authMiddleware, acceptInvitationController);

router.patch("/:invitationId/reject", authMiddleware, rejectInvitationController);

router.patch("/members/:memberId/reactivate", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), reactivateMemberController);

router.get("/:ngoId/details", authMiddleware, requireRole(["SUPER_ADMIN"]), fetchNGODetails);

router.get("/:ngoId/invitations", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), getNgoInvitationsController);


// POST /ngo/apply
router.post("/apply", authMiddleware, applyForNGOController);

router.post("/areas", authMiddleware, requireRole(["SUPER_ADMIN"]), createAreaController);

router.post("/members/invite", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), inviteMemberController);

router.patch("/members/:memberId/suspend", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), suspendMemberController);

router.delete("/members/:memberId", authMiddleware, requireNGOMembership, requireNGOPermission("MANAGE_MEMBERS"), removeMemberController);

router.post("/:ngoId/tasks/:taskId/end", authMiddleware, requireNGOMembership, requireNGOPermission("CREATE_COMMUNITY_TASK"), endEvent);

router.post(
  "/:ngoId/tasks/:taskId/participants/:userId/verify",
  authMiddleware,
  requireNGOMembership,
  requireNGOPermission("REVIEW_SUBMISSIONS"),
  verifyParticipantController
);

export default router;