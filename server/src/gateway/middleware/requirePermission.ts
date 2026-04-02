import { Request, Response, NextFunction } from "express";

export const requirePermission =
  (permission: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // SUPER_ADMIN shortcut
    if (user.role === "SUPER_ADMIN") {
      return next();
    }

    const permissions = user.permissions || [];

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };

//   router.post(
//   "/task/create",
//   requirePermission("TASK_CREATE"),
//   createTask
// );