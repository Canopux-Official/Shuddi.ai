import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../core-backend/dashboard/utils/ApiError";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.log("GLOBAL ERROR HANDLER HIT");
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};