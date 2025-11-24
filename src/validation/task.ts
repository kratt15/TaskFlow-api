import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string('Title is required').min(3).max(20),
  description: z.string('Description is required').min(3).max(70),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
  level: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  categoryId: z.uuid('Category ID is required'),
});

export const updateTaskSchema = createTaskSchema.partial();
