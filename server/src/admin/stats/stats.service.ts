import prisma from "../../lib/prisma";

export const getPlatformStats = async () => {
  const [
    totalUsers,
    activeUsers,

    totalNGOs,
    activeNGOs,
    pendingNGOs,
    suspendedNGOs,

    totalAreas,

    totalTasks,
    activeTasks,

    completedTasks,

    totalCommunityTasks,

    totalMembers,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.nGO.count(),

    prisma.nGO.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.nGO.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.nGO.count({
      where: {
        status: "SUSPENDED",
      },
    }),

    prisma.area.count(),

    prisma.task.count(),

    prisma.task.count({
      where: {
        isActive: true,
      },
    }),

    prisma.taskScore.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.communityTask.count(),

    prisma.nGOMember.count({
      where: {
        status: "ACTIVE",
      },
    }),
  ]);

  return {
    totalUsers,
    activeUsers,

    totalNGOs,
    activeNGOs,
    pendingNGOs,
    suspendedNGOs,

    totalAreas,

    totalTasks,
    activeTasks,

    completedTasks,

    totalCommunityTasks,

    totalMembers,
  };
};

// services/superAdmin.service.ts

interface GetActiveNGOsParams {
  search: string;
  page: number;
  limit: number;
}

export const getActiveNGOsService = async ({
  search,
  page,
  limit,
}: GetActiveNGOsParams) => {
  const where = {
    status: "APPROVED" as const,

    ...(search && {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    }),
  };

  const skip = (page - 1) * limit;

  const [ngos, total] = await Promise.all([
    prisma.nGO.findMany({
      where,
      skip,
      take: limit,

      include: {
        area: {
          select: {
            name: true,
          },
        },

        _count: {
          select: {
            members: {
              where: {
                status: "ACTIVE",
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.nGO.count({ where }),
  ]);

  return {
    ngos: ngos.map((ngo) => ({
      id: ngo.id,
      name: ngo.name,
      area: ngo.area.name,
      members: ngo._count.members,
    })),

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};