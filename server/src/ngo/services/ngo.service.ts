import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

// services/ngoMember.service.ts

export const getMembersByNGOId = async ({
  ngoId,
  page,
  limit,
}: {
  ngoId: string;
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;

  const [members, total] =
    await Promise.all([
      prisma.nGOMember.findMany({
        where: {
          ngoId,
        },

        skip,
        take: limit,

        include: {
          role: true,

          user: {
            select: {
              id: true,
              email: true,
              status: true,
              profile: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.nGOMember.count({
        where: {
          ngoId,
        },
      }),
    ]);

  return {
    members,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(
        total / limit
      ),
    },
  };
};

enum NGOMemberStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  REMOVED = "REMOVED"
}

export const updateMemberStatus = async (
  memberId: string,
  status: NGOMemberStatus
) => {
  const member =
    await prisma.nGOMember.findUnique({
      where: {
        id: memberId,
      },
    });

  if (!member) {
    throw new ApiError(
      404,
      "Member not found"
    );
  }

  return prisma.nGOMember.update({
    where: {
      id: memberId,
    },

    data: {
      status,
    },
  });
};