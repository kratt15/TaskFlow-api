import { z } from 'zod';

export const createUserSchema = z.object({
    username: z.string('Username is required').min(3).max(20),
    email: z.email('Email is required'),
    password: z.string('Password is required').min(8).max(32),
});

export const updateUserSchema = createUserSchema.partial();

export const loginUserSchema = z.object({
    email: z.email('Email is required'),
    password: z.string('Password is required').min(8).max(32),
});