// services/ngo/inviteMember.service.ts

import prisma from "../../lib/prisma";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";
import { getNGOContext } from "../utils/getNGOContext";

interface InviteMemberInput {
  email: string;
  roleId: string;
}

export const inviteMember = async (
  ownerUserId: string,
  input: InviteMemberInput
) => {
  const { email, roleId } = input;

  const ngoContext = await getNGOContext(ownerUserId);


  const ngo = await prisma.nGO.findUnique({
    where: {
      id: ngoContext.ngoId,
    },
  });

  if (!ngo) {
    throw new ApiError(404, "NGO not found");
  }

  if (ngo.status !== "APPROVED") {
    throw new ApiError(400, "NGO is not active");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });


  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.emailVerified) {
    throw new ApiError(
      400,
      "User email is not verified"
    );
  }

  if (user.status !== "ACTIVE") {
    throw new ApiError(
      400,
      "User account is inactive"
    );
  }

  if (user.id === ownerUserId) {
    throw new ApiError(
      400,
      "You cannot invite yourself"
    );
  }

  if (user.areaId !== ngo.areaId) {
    throw new ApiError(
      400,
      "User belongs to a different area"
    );
  }

  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw new ApiError(
      404,
      "Role not found"
    );
  }

  if (role.name === "NGO_OWNER") {
    throw new ApiError(
      400,
      "Cannot invite NGO owners"
    );
  }

  const activeMemberCount =
    await prisma.nGOMember.count({
      where: {
        ngoId: ngo.id,
        status: "ACTIVE",
      },
    });

  if (activeMemberCount >= 5) {
    throw new ApiError(
      400,
      "Maximum member limit reached"
    );
  }

  const existingMembership =
    await prisma.nGOMember.findFirst({
      where: {
        userId: user.id,
        status: {
          in: [
            "ACTIVE",
            "PENDING",
          ],
        },
      },
    });

  if (existingMembership) {
    throw new ApiError(
      400,
      "User is already associated with an NGO"
    );
  }

  const pendingInvitation =
    await prisma.nGOInvitation.findFirst({
      where: {
        ngoId: ngo.id,
        userId: user.id,
        status: "PENDING",
      },
    });

  if (pendingInvitation) {
    throw new ApiError(
      400,
      "Invitation already exists"
    );
  }

  const invitation =
    await prisma.nGOInvitation.create({
      data: {
        ngoId: ngo.id,
        userId: user.id,
        roleId,
        invitedBy: ownerUserId,
      },

      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },

        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

  return invitation;
};


export const getNGORoles = async () => {
  return prisma.role.findMany({
    where: {
      name: {
        in: [
          "NGO_MANAGER",
          "NGO_VOLUNTEER",
        ],
      },
    },

    select: {
      id: true,
      name: true,
      description: true,
    },
  });
};

export const getMembers = async (
  userId: string
) => {

  const ngoContext =
    await getNGOContext(userId);

  return prisma.nGOMember.findMany({
    where: {
      ngoId: ngoContext.ngoId,
    },

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
  });
};


export const acceptInvitation = async (
  invitationId: string,
  userId: string
) => {

  const invitation =
    await prisma.nGOInvitation.findUnique({
      where: {
        id: invitationId,
      },
    });

  if (!invitation) {
    throw new ApiError(
      404,
      "Invitation not found"
    );
  }

  if (
    invitation.userId !== userId
  ) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  if (
    invitation.status !== "PENDING"
  ) {
    throw new ApiError(
      400,
      "Invitation already processed"
    );
  }

  return prisma.$transaction(
    async (tx) => {

      await tx.nGOMember.create({
        data: {
          ngoId: invitation.ngoId,
          userId,
          roleId: invitation.roleId,
          status: "ACTIVE",
        },
      });

      await tx.nGOInvitation.update({
        where: {
          id: invitationId,
        },

        data: {
          status: "ACCEPTED",
        },
      });

      return {
        success: true,
      };
    }
  );
};

export const rejectInvitation =
  async (
    invitationId: string,
    userId: string
  ) => {

    const invitation =
      await prisma.nGOInvitation.findUnique({
        where: {
          id: invitationId,
        },
      });

    if (!invitation) {
      throw new ApiError(
        404,
        "Invitation not found"
      );
    }

    if (
      invitation.userId !== userId
    ) {
      throw new ApiError(
        403,
        "Unauthorized"
      );
    }

    return prisma.nGOInvitation.update({
      where: {
        id: invitationId,
      },

      data: {
        status: "REJECTED",
      },
    });
  };


export const suspendMember =
  async (
    memberId: string,
    ownerUserId: string
  ) => {

    const ngoContext =
      await getNGOContext(
        ownerUserId
      );

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

    if (member.userId === ownerUserId) {
      throw new ApiError(
        400,
        "You cannot perform this action on yourself"
      );
    }

    if (
      member.ngoId !==
      ngoContext.ngoId
    ) {
      throw new ApiError(
        403,
        "Unauthorized"
      );
    }

    return prisma.nGOMember.update({
      where: {
        id: memberId,
      },

      data: {
        status: "SUSPENDED",
      },
    });
  };

export const removeMember =
  async (
    memberId: string,
    ownerUserId: string
  ) => {

    const ngoContext =
      await getNGOContext(
        ownerUserId
      );

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

    if (member.userId === ownerUserId) {
      throw new ApiError(
        400,
        "You cannot perform this action on yourself"
      );
    }

    if (
      member.ngoId !==
      ngoContext.ngoId
    ) {
      throw new ApiError(
        403,
        "Unauthorized"
      );
    }

    return prisma.nGOMember.update({
      where: {
        id: memberId,
      },

      data: {
        status: "REMOVED",
      },
    });
  };