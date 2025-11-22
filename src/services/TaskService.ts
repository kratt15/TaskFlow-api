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
    categoryId: string,
    task: CreateTaskDto
  ): Promise<TaskResponseDto> {
    try {
      const newTask = await prisma.task.create({
        data: {
          ...task,
          user: {
            connect: {
              id: userId,
            },
          },
          category: {
            connect: {
              id: categoryId,
            },
          },
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
    categoryId: string,
    task: UpdateTaskDto
  ): Promise<TaskResponseDto> {
    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          ...task,
          user: {
            connect: {
              id: userId,
            },
          },
          category: {
            connect: {
              id: categoryId,
            },
          },
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
