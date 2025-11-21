import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string("Email is required").email("Invalid email format"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters"),
});

export const updateUserSchema = createUserSchema.partial();

export const loginUserSchema = z.object({
  email: z.string("Email is required").email("Invalid email format"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters"),
});
