import jwt from "jsonwebtoken";
import { Request } from "express";
import { UserRole } from "@prisma/client";

export interface UserContext {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Extract Bearer token from Authorization header
 */
export const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) return null;

  return token;
};

/**
 * Verify JWT token
 * (TEMP: replace logic when core-backend exposes verify function)
 */
export const verifyToken = (token: string): any => {
  try {
    const secret = process.env.JWT_SECRET || "shuddi_for_the_win";
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};

/**
 * Build user context from decoded token
 */
export const buildUserContext = (decoded: any): UserContext => {
  return {
    id: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };
};
