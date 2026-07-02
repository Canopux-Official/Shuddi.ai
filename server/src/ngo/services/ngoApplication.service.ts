import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import { Prisma, DocumentType } from "@prisma/client";

interface DocumentInput {
    type: DocumentType;
    url: string;
}

interface ApplyNGOInput {
    name: string;
    description: string;
    areaId: string;
    documents: DocumentInput[];
}

export const applyForNGO = async (userId: string, input: ApplyNGOInput) => {
    const { name, description, areaId, documents } = input;

    // Check if user already has a pending application
    const existingApplication = await prisma.nGOApplication.findFirst({
        where: {
            userId,
            status: "PENDING",
        },
    });

    const ownedNGO = await prisma.nGO.findFirst({
        where: {
            ownerId: userId,
        },
    });

    if (ownedNGO) {
        throw new ApiError(
            400,
            "You already own an NGO."
        );
    }

    if (existingApplication) {
        throw new ApiError(400, "You already have a pending application.");
    }

    const existingMembership = await prisma.nGOMember.findFirst({
        where: {
            userId,
            status: {
                in: ["ACTIVE", "PENDING"]
            }
        }
    });

    if (existingMembership) {
        throw new ApiError(
            400,
            "You are already associated with an NGO."
        );
    }

    //create the NGO application
    const application = await prisma.nGOApplication.create({
        data: {
            userId,
            name,
            description,
            areaId,
            documents: {
                create: documents.map((doc: DocumentInput) => ({
                    type: doc.type,
                    url: doc.url
                }))
            }
        },
        include: {
            documents: true,
        }
    });

    return application;

}

export const getAllAreas = async () => {
    const areas = await prisma.area.findMany({
        orderBy: {
            name: "asc",
        },
    });
    return areas;
};

export const createArea = async (name: string, code: string) => {
    if (code) {
        const existingArea = await prisma.area.findUnique({
            where: {
                code,
            },
        });

        if (existingArea) {
            throw new ApiError(400, "Area with this code already exists.");
        }
    }

    return await prisma.$transaction(async (tx) => {
        // Create the Area
        const area = await tx.area.create({
            data: {
                name,
                code: code.toUpperCase(),
            },
        });

        // Check if a pending request exists for this area
        const areaRequest = await tx.areaRequest.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
                status: "PENDING",
            },
            include: {
                users: true, // UserAreaRequest[]
            },
        });

        if (areaRequest) {
            // Assign the new Area to all requesting users
            await tx.user.updateMany({
                where: {
                    id: {
                        in: areaRequest.users.map((u) => u.userId),
                    },
                },
                data: {
                    areaId: area.id,
                },
            });

            // Mark request as approved
            await tx.areaRequest.update({
                where: {
                    id: areaRequest.id,
                },
                data: {
                    status: "APPROVED",
                },
            });
            
            // or you can delete the area request and its associated user requests if you want to clean up the database:
            // await tx.userAreaRequest.deleteMany({
            //     where: {
            //         areaRequestId: areaRequest.id,
            //     },
            // });
        }

        return area;
    });
};