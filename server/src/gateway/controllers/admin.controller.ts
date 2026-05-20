import {request, response} from "express";
import { getPermissionsByRole } from "../../admin/permissions/permission.service";
import { updateApplicationStatus } from "../../ngo/admin-function/applicationModeration.service";
import { updateNGOStatus } from "../../ngo/admin-function/ngoModeration.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getMyPermission = asyncHandler(async (req: typeof request, res: typeof response) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const permissions = getPermissionsByRole(user.role);
    return res.status(200).json({
        success: true,
        data: permissions,
    });
});

export const moderateNGOApplication = asyncHandler(async (req: typeof request, res: typeof response) => {
    const applicationId = req.params.id as string;

    const { status } = req.body as { status: "APPROVED" | "REJECTED" };

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    const result = await updateApplicationStatus(
      applicationId,
      status
    );

    return res.status(200).json({
      success: true,
      message: `Application ${status.toLowerCase()} successfully`,
      data: result,
    });
});

export const moderateNGOStatus = asyncHandler(async (req: typeof request, res: typeof response) => {
    const ngoId = req.params.id as string;

    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!["APPROVED", "SUSPENDED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid NGO status",
      });
    }

    const result = await updateNGOStatus(
      ngoId,
      status
    );

    return res.status(200).json({
      success: true,
      message: `NGO status updated to ${status}`,
      data: result,
    });
});
