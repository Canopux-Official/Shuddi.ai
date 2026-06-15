import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

export const getNGOContext = async (userId: string) => {

    const membership = await prisma.nGOMember.findFirst({
        where: {
            userId,
            status: "ACTIVE",
        },

        include: {
            ngo: {
                include: {
                    area: true,
                },
            },

            role: {
                include: {
                    permissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            },
        },
    });

    if (!membership) {
        throw new ApiError(
            403,
            "User is not associated with any NGO"
        );
    }

    if (!membership.ngo) {
        throw new ApiError(
            404,
            "NGO not found"
        );
    }

    return {
        ngoId: membership.ngo.id,

        ngoName: membership.ngo.name,

        ngoStatus: membership.ngo.status,

        areaId: membership.ngo.areaId,

        areaName: membership.ngo.area.name,

        roleName: membership.role.name,

        permissions:
            membership.role.permissions.map(
                (rp) => rp.permission.key
            ),

        isOwner:
            membership.ngo.ownerId === userId,
    };
};