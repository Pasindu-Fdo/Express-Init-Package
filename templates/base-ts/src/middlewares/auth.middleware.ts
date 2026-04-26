import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { JwtUserPayload, UserRole } from "../types/auth.type.js";
import userRepository from "../repositories/user.repository.js";
import logger from "../utils/logger.js";
export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }

    const token = authHeader.split(" ")[1]!;
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtUserPayload;

    const user = await userRepository.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = { id: user.id, role: user.role };

    next();
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize =
  (...allowedRoles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
