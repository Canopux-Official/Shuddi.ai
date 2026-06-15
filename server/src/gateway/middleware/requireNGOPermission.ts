import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

export const requireNGOPermission =
  (
    permission: string
  ) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const ngoContext =
      req.ngoContext;

    if (!ngoContext) {
      return next(
        new ApiError(
          403,
          "NGO access required"
        )
      );
    }

    const hasPermission =
      ngoContext.permissions.includes(
        permission
      );

    if (!hasPermission) {
      return next(
        new ApiError(
          403,
          "Insufficient permissions"
        )
      );
    }

    next();
};