import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string('Title is required').min(3).max(20),
    description: z.string('Description is required').min(3).max(20),
    status: z.enum(['not_started', 'in_progress', 'completed']),
    level: z.enum(['low', 'medium', 'high']),
});

export const updateTaskSchema = createTaskSchema.partial();