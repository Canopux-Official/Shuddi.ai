import { Request, Response } from "express";
import { applyForNGO, createArea, getAllAreas } from "../../ngo/services/ngoApplication.service";
import { getNGOModerationData } from "../../ngo/admin-function/fetching.service";
import { asyncHandler } from "../utils/asyncHandler";
import { dailyTasks } from "../../tasks/individual-tasks/services/task.service";
import { getNGODetails } from "../../ngo/admin-function/details.service";
import {getNGODashboard} from "../../ngo/services/getNGODashboard.service";
import { inviteMember, getNGORoles, getMembers, removeMember, suspendMember, getNgoInvitations,
  acceptInvitation, rejectInvitation,
  getMyInvitations, reactivateMember
 } from "../../ngo/services/member.service";

export const applyForNGOController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id; 

    if(!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const application = await applyForNGO(userId, req.body);
    return res.status(201).json({
      success: true,
      message: "NGO application submitted successfully",
      data: application
    });

});

export const getAreasController = asyncHandler(async (req: Request, res: Response) => {
    const areas = await getAllAreas();
    return res.status(200).json({
        success: true,
        data: areas,
    });
});

export const createAreaController = asyncHandler(async (req: Request, res: Response) => {
    const { name, code } = req.body;  
    if(!name || !code) {
        return res.status(400).json({ success: false, message: "Name and code are required" });
    }
    const area = await createArea(name, code);
    return res.status(201).json({
        success: true,
        data: area,
    });
});

export const getNGOModerationDataController = asyncHandler(async (req: Request, res: Response) => {
    const moderationData = await getNGOModerationData();
    return res.status(200).json({
        success: true,
        data: moderationData,
    });
});

export const fetchNGODetails = asyncHandler(async (req: Request, res: Response) => {
    const ngoId = req.params.ngoId as string;

    const ngo = await getNGODetails(ngoId);

    return res.status(200).json({
      success: true,
      data: ngo,
    });
});

export const getNGODashboardController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const dashboardData = await getNGODashboard(userId);

    return res.status(200).json({
        success: true,
        data: dashboardData,
    });
});

export const inviteMemberController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  
  const invitation = await inviteMember(userId, req.body);

  return res.status(201).json({
    success: true,
    message: "Invitation sent successfully",
    data: invitation,
  });
});

export const getNGORolesController = asyncHandler(async (req: Request, res: Response) => {
  const roles = await getNGORoles();
  return res.status(200).json({
    success: true,
    data: roles,
  });
});

export const getMembersController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const members = await getMembers(userId);

  return res.status(200).json({
    success: true,
    data: members,
  });
});

export const suspendMemberController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { memberId } = req.params;

  const member = await suspendMember(memberId as string, userId);

  return res.status(200).json({
    success: true,
    message: "Member suspended successfully",
    data: member,
  });
});

export const removeMemberController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { memberId } = req.params;

  const member = await removeMember(memberId as string, userId);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
    data: member,
  });
});

export const getNgoInvitationsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const {ngoId} = req.params;

  const invitations = await getNgoInvitations(ngoId as string, userId);

  res.status(200).json({
    success: true,
    data: invitations,
  });
});

export const acceptInvitationController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { invitationId } = req.params;

  const invitation = await acceptInvitation(invitationId as string, userId);

  return res.status(200).json({
    success: true,
    message: "Invitation accepted successfully",
    data: invitation,
  });
});

export const rejectInvitationController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { invitationId } = req.params;

  const invitation = await rejectInvitation(invitationId as string, userId);

  return res.status(200).json({
      success: true,
      message: "Invitation rejected successfully",
      data: invitation,
  });
});

export const getMyInvitationsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const invitations = await getMyInvitations(userId);

  return res.status(200).json({
    success: true,
    data: invitations,
  });
});

export const reactivateMemberController = asyncHandler(async (req: Request, res: Response) => {
  const { memberId } = req.params;

  const member = await reactivateMember(memberId as string);

  return res.status(200).json({
    success: true,
    message: "Member reactivated successfully",
    data: member,
  });
});