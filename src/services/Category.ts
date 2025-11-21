import type { CreateCategoryDto, CategoryResponseDto } from '../interfaces/category.js';
import { prisma } from '../config/prisma.js';
import { getUserId } from '../middleware/auth.js';
export class CategoryService {
  async getAll(userId: string): Promise<CategoryResponseDto[]> {
    try {
      const categories = await prisma.category.findMany({
        where: { userId },
      });
      return categories;
    } catch (error) {
      throw error;
    }
  }
  async getById(id: string): Promise<CategoryResponseDto> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
      });
      return category!;
    } catch (error) {
      throw error;
    }
  }
  async create(userId: string, data: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      ;
      const category = await prisma.category.create({
        data: {
          ...data,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return category;
    } catch (error) {
      throw error;
    }
  }
  async update(id: string, data: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      const category = await prisma.category.update({
        where: { id },
        data,
      });
      return category!;
    } catch (error) {
      throw error;
    }
  }
  async delete(id: string): Promise<void> {
    try {
      await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }


}
