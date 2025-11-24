import { ZodError } from 'zod';
import { type Response } from 'express';

export interface FormattedValidationError {
  error: string;
  details: Record<string, string>;
}

export interface ErrorResponse {
  status: number;
  body: {
    error: string;
    details?: Record<string, string>;
    message?: string;
    field?: string;
  };
}

export class ValidationErrorService {
  /**
   * Formate les erreurs Zod en un format lisible pour l'API
   * @param error - L'erreur Zod à formater
   * @returns Un objet avec le message d'erreur principal et les détails par champ
   */
  static formatZodError(error: ZodError): FormattedValidationError {
    const formattedErrors: Record<string, string> = {};

    error.issues.forEach(issue => {
      const path = issue.path.join('.');
      formattedErrors[path] = issue.message;
    });

    // Retourner le premier message d'erreur comme message principal
    const firstError = error.issues[0];
    const mainMessage = firstError
      ? `${firstError.path.join('.')}: ${firstError.message}`
      : 'Validation error';

    return {
      error: mainMessage,
      details: formattedErrors,
    };
  }

  /**
   * Vérifie si une erreur est une erreur Zod
   * @param error - L'erreur à vérifier
   * @returns true si c'est une erreur Zod, false sinon
   */
  static isZodError(error: unknown): error is ZodError {
    return error instanceof ZodError;
  }

  /**
   * Formate les erreurs Prisma de contrainte unique
   * @param error - L'erreur Prisma
   * @returns Un objet avec le message d'erreur et le champ concerné
   */
  static formatPrismaUniqueError(error: any): {
    error: string;
    field: string;
  } {
    const target = error.meta?.target;
    let errorMessage = 'This value already exists';

    if (Array.isArray(target)) {
      if (target.includes('email') && target.includes('username')) {
        errorMessage = 'Email and username already exist';
      } else if (target.includes('email')) {
        errorMessage = 'Email already exists';
      } else if (target.includes('username')) {
        errorMessage = 'Username already exists';
      }
    }

    return {
      error: errorMessage,
      field: target?.[0] || 'unknown',
    };
  }

  /**
   * Formate les erreurs Prisma génériques
   * @param error - L'erreur Prisma
   * @returns Un objet avec le message d'erreur formaté
   */
  static formatPrismaError(error: any): { error: string; message: string } {
    const errorMessage =
      error.message?.split('\n')[0] || 'Database error occurred';
    return {
      error: 'Database error',
      message: errorMessage,
    };
  }

  /**
   * Gère les erreurs métier (User not found, Invalid password, etc.)
   * @param error - L'erreur à vérifier
   * @returns Un objet ErrorResponse si c'est une erreur métier, null sinon
   */
  static handleBusinessError(error: unknown): ErrorResponse | null {
    if (!(error instanceof Error)) {
      return null;
    }

    const message = error.message.toLowerCase();

    // Erreurs d'authentification
    if (message === 'user not found' || message === 'invalid password') {
      return {
        status: 401,
        body: { error: 'Invalid credentials' },
      };
    }

    if (
      message === 'user id not found in request' ||
      message === 'user id is required'
    ) {
      return {
        status: 401,
        body: { error: 'User ID not found in request' },
      };
    }

    if (message === 'user not found') {
      return {
        status: 404,
        body: { error: 'User not found' },
      };
    }

    if (message === 'invalid or expired token') {
      return {
        status: 403,
        body: { error: 'Invalid or expired token' },
      };
    }

    if (message === 'access token required') {
      return {
        status: 401,
        body: { error: 'Access token required' },
      };
    }

    return null;
  }

  /**
   * Gère les erreurs Prisma
   * @param error - L'erreur à vérifier
   * @returns Un objet ErrorResponse si c'est une erreur Prisma, null sinon
   */
  static handlePrismaError(error: any): ErrorResponse | null {
    // Erreur de contrainte unique (P2002)
    if (error.code === 'P2002') {
      const formattedError = this.formatPrismaUniqueError(error);
      return {
        status: 409,
        body: formattedError,
      };
    }

    // Autres erreurs Prisma (commencent par P)
    if (
      error.code &&
      typeof error.code === 'string' &&
      error.code.startsWith('P')
    ) {
      const formattedError = this.formatPrismaError(error);
      return {
        status: 400,
        body: formattedError,
      };
    }

    return null;
  }

  /**
   * Gère toutes les erreurs et retourne la réponse appropriée
   * @param error - L'erreur à gérer
   * @param res - L'objet Response Express (optionnel, pour envoyer directement la réponse)
   * @returns Un objet ErrorResponse ou null si res est fourni
   */
  static handleError(error: unknown, res?: Response): ErrorResponse | null {
    // Erreurs Zod (validation)
    if (this.isZodError(error)) {
      const formattedError = this.formatZodError(error);
      const response: ErrorResponse = {
        status: 400,
        body: formattedError,
      };

      if (res) {
        res.status(response.status).json(response.body);
        return null;
      }
      return response;
    }

    // Erreurs métier
    const businessError = this.handleBusinessError(error);
    if (businessError) {
      if (res) {
        res.status(businessError.status).json(businessError.body);
        return null;
      }
      return businessError;
    }

    // Erreurs Prisma
    const prismaError = this.handlePrismaError(error);
    if (prismaError) {
      if (res) {
        res.status(prismaError.status).json(prismaError.body);
        return null;
      }
      return prismaError;
    }

    // Erreur générique
    const genericError: ErrorResponse = {
      status: 500,
      body: {
        error: 'Internal server error',
        message:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
    };

    if (res) {
      res.status(genericError.status).json(genericError.body);
      return null;
    }

    return genericError;
  }
}
