import { request, response } from "express";
import { getPermissionsByRole } from "../../admin/permissions/permission.service";
import { updateApplicationStatus } from "../../ngo/admin-function/applicationModeration.service";
import { updateNGOStatus } from "../../ngo/admin-function/ngoModeration.service";
import { asyncHandler } from "../utils/asyncHandler";
import { createTaskService, deactivateTaskService, getAllTasksService, getDeactivatedTasksService, reactivateTaskService } from "../../admin/task-governance/admin.service";
import { TaskType, } from "@prisma/client";
import {createRewardService, deleteRewardService} from "../../admin/reward-governance/reward.service";
import { CreateRewardInput } from "../../validation/reward.validation";

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


export const getSearchTasks = asyncHandler(async (req: typeof request, res: typeof response) => {
  const { search, type, isActive, page = 1, limit = 10 } = req.query;
  
  const currentPage = Math.max(Number(page), 1);
  const itemsPerPage = Math.max(Number(limit), 1);

  const result = await getAllTasksService({
    search: String(search),
    type:
      type && Object.values(TaskType).includes(type as TaskType)
        ? (type as TaskType)
        : undefined,
    isActive:
      isActive !== undefined
        ? isActive === "true"
        : undefined,
    page: currentPage,
    limit: itemsPerPage,
  });

  //Frontend should handle empty state UI.
  return res.status(200).json({
    success: true,
    message: "Tasks fetched successfully",
    data: result,
  });
});

export const createTask = asyncHandler(async (req: typeof request, res: typeof response) => {
  const result = await createTaskService(req.body);

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

export const deactiveteTask = asyncHandler(async (req: typeof request, res: typeof response) => {
  const { id } = req.params;

  const task = await deactivateTaskService(id as string);

  return res.status(200).json({
    success: true,
    message: "Task deactivated successfully",
    data: task,
  });
});

export const getDeactivatedTasks = asyncHandler(async (req: typeof request, res: typeof response) => {
  const {
    search = "",
    page = 1,
    limit = 10, 
  } = req.query;
  const currentPage = Math.max(Number(page), 1);

    const pageLimit = Math.min(
      Math.max(Number(limit), 1),
      50
    );

    const result = await getDeactivatedTasksService({
      search: String(search),
      page: currentPage,
      limit: pageLimit,
    });

    return res.status(200).json({
      success: true,
      message: "Deactivated tasks fetched successfully",
      data: result,
    });
});

export const reactivateTask = asyncHandler(async (req: typeof request, res: typeof response) => {
  const { id } = req.params;

  const task = await reactivateTaskService(id as string);

  return res.status(200).json({
    success: true,
    message: "Task reactivated successfully",
    data: task,
  });
});


export const createReward = asyncHandler(async (req: typeof request, res: typeof response) => {
  const validatedData = req.body as CreateRewardInput;

  const reward = await createRewardService(validatedData);

  return res.json({
    success: true,
    message: "Reward created successfully",
    data: reward,
  });
});

export const deleteReward = asyncHandler(async (req: typeof request, res: typeof response) => { 
  const { id } = req.params;

  const result = await deleteRewardService(id as string);

  return res.json({ 
    success: true,
    ...result,
  });
});