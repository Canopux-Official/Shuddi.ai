// this approves or rejects the ngo application

import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

export const updateApplicationStatus = async (
  applicationId: string,
  status: "APPROVED" | "REJECTED"
) => {

  const application = await prisma.nGOApplication.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  if (application.status !== "PENDING") {
    throw new ApiError(400, "Application already processed");
  }

  if (status === "REJECTED") {

    return await prisma.nGOApplication.update({
      where: {
        id: applicationId,
      },

      data: {
        status: "REJECTED",
      },
    });
  }

  return await prisma.$transaction(async (tx) => {

    const ngo = await tx.nGO.create({
      data: {
        name: application.name,
        areaId: application.areaId,
        ownerId: application.userId,
        status: "APPROVED",
      },
    });

    const ownerRole = await tx.role.findUnique({
      where: {
        name: "NGO_OWNER",
      },
    });

    if (!ownerRole) {
      throw new ApiError(500, "OWNER role not found");
    }

    await tx.nGOMember.create({
      data: {
        ngoId: ngo.id,
        userId: application.userId,
        roleId: ownerRole.id,
        status: "ACTIVE",
      },
    });

    await tx.actionLog.create({
      data: {
        ngoId: ngo.id,
        action: "NGO_CREATED",
        details: "NGO approved by super admin",
      },
    });

    await tx.nGOApplication.update({
      where: {
        id: applicationId,
      },

      data: {
        status: "APPROVED",
      },
    });

    return ngo;
  });
};