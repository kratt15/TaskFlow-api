import { prisma } from '../config/prisma.js';
import type {
  CreateTaskDto,
  TaskResponseDto,
  UpdateTaskDto,
} from '../interfaces/task.js';
export class TaskService {
  async getAll(userId: string): Promise<TaskResponseDto[]> {
    try {
      const tasks = await prisma.task.findMany({
        where: {
          userId,
        },
      });
      return tasks;
    } catch (error) {
      throw error;
    }
  }
  async getById(id: string): Promise<TaskResponseDto> {
    try {
      const task = await prisma.task.findUnique({
        where: { id },
      });
      return task!;
    } catch (error) {
      throw error;
    }
  }
  async create(
    userId: string,
    categoryId: string | undefined,
    task: CreateTaskDto
  ): Promise<TaskResponseDto> {
    try {
      const newTask = await prisma.task.create({
        data: {
          ...task,
          userId,
          categoryId: categoryId || null,
        },
      });
      return newTask;
    } catch (error) {
      throw error;
    }
  }
  async update(
    id: string,
    userId: string,
    categoryId: string | undefined,
    task: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    try {
      // Filtrer les propriétés undefined pour compatibilité avec Prisma et exactOptionalPropertyTypes
      const taskData = Object.fromEntries(
        Object.entries(task).filter(([_, value]) => value !== undefined)
      );

      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          ...taskData,
          userId,
          categoryId: categoryId !== undefined ? categoryId : null,
        },
      });
      return updatedTask!;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}
