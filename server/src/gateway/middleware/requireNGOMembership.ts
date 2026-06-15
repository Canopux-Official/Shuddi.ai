import { NextFunction, Request, Response } from "express";
import { getNGOContext } from "../../ngo/utils/getNGOContext";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

export const requireNGOMembership =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    const userId = req.user?.id;
    

    if (!userId) {
      return next(
        new ApiError(
          401,
          "Unauthorized"
        )
      );
    }

    const ngoContext =
      await getNGOContext(userId);

    if (
      ngoContext.ngoStatus !==
      "APPROVED"
    ) {
      return next(
        new ApiError(
          403,
          "NGO is suspended"
        )
      );
    }

    req.ngoContext =
      ngoContext;

    next();
  };