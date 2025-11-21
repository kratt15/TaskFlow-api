import { type Request, type Response, type NextFunction } from "express";
import { AuthService } from "../services/AuthService.js";
declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
  }
  
const authService = new AuthService();

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const decoded = authService.verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};