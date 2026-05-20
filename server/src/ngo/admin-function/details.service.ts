import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

//apply pagination here
export const getNGODetails = async (ngoId: string) => {
    const ngo = await prisma.nGO.findUnique({
        where: {
            id: ngoId,
        },

        select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,

            area: {
                select: {
                    id: true,
                    name: true,
                },
            },

            _count: {
                select: {
                    members: true,
                },
            },

            logs: {
                select: {
                    id: true,
                    action: true,
                    details: true,
                    createdAt: true,
                },

                orderBy: {
                    createdAt: "desc",
                },

                take: 20,
            },
        },
    });

    if (ngo) {
        return {
            type: "NGO",

            data: {
                ...ngo,
                memberCount: ngo._count.members,
            },
        };
    }

    // Otherwise check pending NGO application
    const application = await prisma.nGOApplication.findUnique({
        where: {
            id: ngoId,
        },

        select: {
            id: true,
            name: true,
            description: true,
            status: true,
            createdAt: true,

            user: {
                select: {
                    id: true,
                    email: true,
                },
            },

            area: {
                select: {
                    id: true,
                    name: true,
                },
            },

            documents: {
                select: {
                    id: true,
                    type: true,
                    url: true,
                    uploadedAt: true,
                },
            },
        },
    });

    if (application) {
        return {
            type: "APPLICATION",
            data: application,
        };
    }

    throw new ApiError(404, "NGO or Application not found");
};