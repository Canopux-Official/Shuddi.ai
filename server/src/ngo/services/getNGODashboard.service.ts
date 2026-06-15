import prisma from "../../lib/prisma";
import { getNGOContext } from "../utils/getNGOContext";

export const getNGODashboard = async (
    userId: string
) => {

    const ngoContext =
        await getNGOContext(userId);

    const ngoId = ngoContext.ngoId;

    const [
        totalMembers,
        activeMembers,
        communityTaskCount,
        activeCommunityTaskCount,
    ] = await Promise.all([

        prisma.nGOMember.count({
            where: {
                ngoId,
            },
        }),

        prisma.nGOMember.count({
            where: {
                ngoId,
                status: "ACTIVE",
            },
        }),

        prisma.communityTask.count({
            where: {
                ngoId,
            },
        }),

        prisma.communityTask.count({
            where: {
                ngoId,
                task: {
                    isActive: true,
                },
            },
        }),
    ]);

    return {
        ngo: {
            id: ngoContext.ngoId,
            name: ngoContext.ngoName,
            status: ngoContext.ngoStatus,

            area: {
                id: ngoContext.areaId,
                name: ngoContext.areaName,
            },
        },

        membership: {
            role: ngoContext.roleName,

            permissions:
                ngoContext.permissions,

            isOwner:
                ngoContext.isOwner,
        },

        stats: {
            totalMembers,
            activeMembers,

            totalCommunityTasks:
                communityTaskCount,

            activeCommunityTasks:
                activeCommunityTaskCount,
        },
    };
};