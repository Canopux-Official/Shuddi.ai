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

    if (existingApplication) {
        throw new ApiError(400, "You already have a pending application.");
    }

    const existingMembership = await prisma.nGOMember.findFirst({
        where: {
            userId,
            role: {
                name: "OWNER",
            },
        },
    });
    
    if (existingMembership) {
        throw new ApiError(400, "You are already a member of an NGO.");
    }

    //create the NGO application
    const application = await prisma.nGOApplication.create({
        data: {
            userId,
            name,
            description,
            areaId,
            documents: {
                create: documents.map((doc : DocumentInput) => ({
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
    if(code){
        const existingArea = await prisma.area.findUnique({
            where: {
                code,
            },
        });
        if (existingArea) {
            throw new ApiError(400, "Area with this code already exists.");
        }
    }
    const area = await prisma.area.create({
        data: {
            name,   
            code: code.toUpperCase(),
        },
    });
    return area;
}