import { Request, Response, NextFunction } from "express";
import {
  extractToken,
  verifyToken,
  buildUserContext,
} from "../gateway.utils";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  //token is also getting verified and decoded
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Attach user context to request
  req.user = buildUserContext(decoded);

  next();
};

/**
 * Created src/types/express.d.ts
 */