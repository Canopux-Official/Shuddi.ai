import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";

export const requirePermission =
  (permission: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (user.role === "SUPER_ADMIN") {
        return next();
      }

      const ngoId = req.body?.ngoId || req.params?.ngoId;

      // TEMP debug — remove once this is working
      // console.log("[requirePermission]", {
      //   permission,
      //   userId: user.id,
      //   ngoId,
      // });

      if (!ngoId) {
        return res.status(400).json({ message: "ngoId is required" });
      }

      if (!user.id) {
        console.log("[requirePermission] user.id is missing from req.user:", user);
        return res.status(401).json({ message: "Unauthorized" });
      }

      const membership = await prisma.nGOMember.findUnique({
        where: { ngoId_userId: { ngoId, userId: user.id } },
        include: {
          role: {
            include: { permissions: { include: { permission: true } } },
          },
        },
      });

      // console.log("[requirePermission] membership:", membership);

      if (!membership || membership.status !== "ACTIVE") {
        return res.status(403).json({ message: "Forbidden: not an active member" });
      }

      const permissionKeys = membership.role.permissions.map((rp) => rp.permission.key);

      // console.log("[requirePermission] permissionKeys:", permissionKeys);

      if (!permissionKeys.includes(permission)) {
        return res.status(403).json({ message: "Forbidden: insufficient permissions" });
      }

      next();
    } catch (err: any) {
      // console.log("[Controller Error Details]:", err.message || err);
      console.error("[requirePermission] error:", err);
      return res.status(500).json({ message: "Permission check failed" });
    }
  };

//   router.post(
//   "/task/create",
//   requirePermission("TASK_CREATE"),
//   createTask
// );