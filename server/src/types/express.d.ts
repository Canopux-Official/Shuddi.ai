import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: UserRole;
      permissions?: string[];
    }

    interface Request {
      user: User;
      ngoContext?: {
        ngoId: string;
        ngoName: string;
        ngoStatus: NGOStatus;
        areaId: string;
        areaName: string;
        roleName: string;
        permissions: string[];
        isOwner: boolean;
      };
    }
  }
}

export {};
