import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string('Name is required').min(3).max(20),
});

export const updateCategorySchema = createCategorySchema.partial();

export const getCategorySchema = z.object({
    id: z.string('Id is required'),
});

export const getCategoriesSchema = z.object({
    page: z.number('Page is required').min(1),
    limit: z.number('Limit is required').min(1),
});