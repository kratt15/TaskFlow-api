import { type Request, type Response } from 'express';
import { CategoryService } from '../services/Category.js';
import { createCategorySchema, updateCategorySchema } from '../validation/category.js';
import { ValidationErrorService } from '../services/validation/ValidationErrorService.js';

const categoryService = new CategoryService();

export class CategoryController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const categories = await categoryService.getAll(userId);
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error });
    }
  }
  async getById(req: Request, res: Response): Promise<void> {
    try {
      
      const category = await categoryService.getById(req.params.id!);
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error });
    }
  }
  async create(req: Request, res: Response): Promise<void> {
      try {
        const validatedData = createCategorySchema.parse(req.body);
      const userId = req.userId!;
      const category = await categoryService.create(userId, validatedData);
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error });
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = updateCategorySchema.parse(req.body);
      const category = await categoryService.update(req.params.id!, {
        name: validatedData.name!,
      });
      res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
      if (ValidationErrorService.isZodError(error)) {
        const formattedError = ValidationErrorService.formatZodError(error);
        res.status(400).json(formattedError);
        return;
      }
      res.status(500).json({ error: 'Internal server error', message: error });
    }
  }
  async delete(req: Request, res: Response): Promise<void> {
    try {
     await categoryService.delete(req.params.id!);
      res.status(204).send({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error });
    }
  }  
}
