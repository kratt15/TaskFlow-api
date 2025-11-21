import { ZodError } from "zod";

export interface FormattedValidationError {
  error: string;
  details: Record<string, string>;
}

export class ValidationErrorService {
  /**
   * Formate les erreurs Zod en un format lisible pour l'API
   * @param error - L'erreur Zod à formater
   * @returns Un objet avec le message d'erreur principal et les détails par champ
   */
  static formatZodError(error: ZodError): FormattedValidationError {
    const formattedErrors: Record<string, string> = {};

    error.issues.forEach((issue) => {
      const path = issue.path.join(".");
      formattedErrors[path] = issue.message;
    });

    // Retourner le premier message d'erreur comme message principal
    const firstError = error.issues[0];
    const mainMessage = firstError
      ? `${firstError.path.join(".")}: ${firstError.message}`
      : "Validation error";

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
    let errorMessage = "This value already exists";

    if (Array.isArray(target)) {
      if (target.includes("email") && target.includes("username")) {
        errorMessage = "Email and username already exist";
      } else if (target.includes("email")) {
        errorMessage = "Email already exists";
      } else if (target.includes("username")) {
        errorMessage = "Username already exists";
      }
    }

    return {
      error: errorMessage,
      field: target?.[0] || "unknown",
    };
  }
}

