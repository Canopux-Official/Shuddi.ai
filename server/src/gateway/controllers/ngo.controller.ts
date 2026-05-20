import { Request, Response } from "express";
import { applyForNGO, createArea, getAllAreas } from "../../ngo/services/ngoApplication.service";
import { getNGOModerationData } from "../../ngo/admin-function/fetching.service";
import { asyncHandler } from "../utils/asyncHandler";
import { dailyTasks } from "../../tasks/individual-tasks/services/task.service";
import { getNGODetails } from "../../ngo/admin-function/details.service";

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