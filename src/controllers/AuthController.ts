import { type Request, type Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { ValidationErrorService } from "../services/validation/ValidationErrorService.js";
import { loginUserSchema, createUserSchema } from "../validation/user.js";
import type { AuthResponseDto, UserResponseDto } from "../interfaces/user.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validation avec Zod
      const validatedData = createUserSchema.parse(req.body);

      const user = (await authService.register(
        validatedData
      )) as UserResponseDto;

      // Retourner l'utilisateur sans le mot de passe

      res.status(201).json({
        user,
      });
    } catch (error: any) {
      if (ValidationErrorService.isZodError(error)) {
        const formattedError = ValidationErrorService.formatZodError(error);
        res.status(400).json(formattedError);
        return;
      }
      if (error.code === "P2002") {
        // Erreur de contrainte unique violée
        const formattedError =
          ValidationErrorService.formatPrismaUniqueError(error);
        res.status(409).json(formattedError);
        return;
      }
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validation avec Zod
      const validatedData = loginUserSchema.parse(req.body);

      const { user, token } = await authService.login(validatedData);

      res.status(200).json({
        user,
        token,
      });
    } catch (error: any) {
      if (ValidationErrorService.isZodError(error)) {
        const formattedError = ValidationErrorService.formatZodError(error);
        res.status(400).json(formattedError);
        return;
      }
      if (
        error.message === "User not found" ||
        error.message === "Invalid password"
      ) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "User ID not found in request" });
        return;
      }
      const user = await authService.getMe(req.userId);
      res.status(200).json({ user });
    } catch (error: any) {
      if (error.message === "User not found") {
        res.status(404).json({ error: "User not found" });
        return;
      }
      // Formater les erreurs Prisma de manière plus lisible
      if (error.code && error.code.startsWith("P")) {
        res.status(400).json({
          error: "Database error",
          message: error.message?.split("\n")[0] || "An error occurred",
        });
        return;
      }
      res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }
}
