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
    }
  }
}

export {};
