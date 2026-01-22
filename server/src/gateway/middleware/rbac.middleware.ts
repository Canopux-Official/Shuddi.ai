import { Request, Response, NextFunction } from "express";

/**
 * Role-Based Access Control Middleware
 * @param allowedRoles - array of roles allowed to access the route
 */
export const requireRole =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // authMiddleware should already attach user
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };


// Example use case
// router.post(
//   "/create-user",
//   authMiddleware,
//   requireRole(["ADMIN"]),
//   createUser
// );