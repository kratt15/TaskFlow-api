import { type Request, type Response } from 'express';
import { AuthService } from '../services/AuthService.js';
import { ValidationErrorService } from '../services/validation/ValidationErrorService.js';
import { loginUserSchema, createUserSchema } from '../validation/user.js';
import type { AuthResponseDto, UserResponseDto } from '../interfaces/user.js';

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
      ValidationErrorService.handleError(error, res);
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
      ValidationErrorService.handleError(error, res);
    }
  }

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: 'User ID not found in request' });
        return;
      }
      const user = await authService.getMe(req.userId);
      res.status(200).json({ user });
    } catch (error: any) {
      ValidationErrorService.handleError(error, res);
    }
  }
}
