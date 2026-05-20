import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

export const getNGOModerationData = async() => {
    const approvedNGOs = await prisma.nGO.findMany({
    where: {
      status: "APPROVED",
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const suspendedNGOs = await prisma.nGO.findMany({
    where: {
      status: "SUSPENDED",
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
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingApplications = await prisma.nGOApplication.findMany({
    where: {
      status: "PENDING",
    },
    select: {
      id: true,
      name: true,
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
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    approvedNGOs,
    suspendedNGOs,
    pendingApplications,
  };
}