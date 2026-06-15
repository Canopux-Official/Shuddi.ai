import {
  NextFunction,
  Request,
  Response,
} from "express";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

export const requireNGOOwner =
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    if (
      !req.ngoContext?.isOwner
    ) {
      return next(
        new ApiError(
          403,
          "Owner access required"
        )
      );
    }

    next();
  };