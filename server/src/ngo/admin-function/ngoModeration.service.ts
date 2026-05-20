// this suspend or reactivate the ngo based on the action taken by the super admin

import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

export const updateNGOStatus = async (
    ngoId: string,
    status: "APPROVED" | "SUSPENDED"
) => {

    const ngo = await prisma.nGO.findUnique({
        where: {
            id: ngoId,
        },
    });

    if (!ngo) {
        throw new ApiError(404, "NGO not found");
    }

    const updatedNGO = await prisma.nGO.update({
        where: {
            id: ngoId,
        },

        data: {
            status,
        },
    });

    await prisma.actionLog.create({
        data: {
            ngoId,
            action: `NGO_${status}`,
            details: `NGO status changed to ${status}`,
        },
    });

    return updatedNGO;
};