import { type Request, type Response } from 'express';
import { TaskService } from '../services/TaskService.js';
import { createTaskSchema, updateTaskSchema } from '../validation/task.js';
import { ValidationErrorService } from '../services/validation/ValidationErrorService.js';

const taskService = new TaskService();

export class TaskController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const tasks = await taskService.getAll(userId);
      res.status(200).json(tasks);
    } catch (error) {
      ValidationErrorService.handleError(error, res);
    }
  }
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await taskService.getById(req.params.id!);
      res.status(200).json(task);
    } catch (error) {
      ValidationErrorService.handleError(error, res);
    }
  }
  async create(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = createTaskSchema.parse(req.body);
      const userId = req.userId!;

      const task = await taskService.create(
        userId,
        validatedData.categoryId!,
        validatedData
      );
      res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
      ValidationErrorService.handleError(error, res);
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = updateTaskSchema.parse(req.body);
      const userId = req.userId!;
      const categoryId = validatedData.categoryId;

      if (!categoryId) {
        res.status(400).json({ error: 'Category ID is required' });
        return;
      }

      const task = await taskService.update(
        req.params.id!,
        userId,
        categoryId,
        validatedData
      );
      res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
      ValidationErrorService.handleError(error, res);
    }
  }
  async delete(req: Request, res: Response): Promise<void> {
    try {
      await taskService.delete(req.params.id!);
      res.status(204).send({ message: 'Task deleted successfully' });
    } catch (error) {
      ValidationErrorService.handleError(error, res);
    }
  }
}
