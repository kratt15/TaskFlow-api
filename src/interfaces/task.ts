import type { TaskLevel, TaskStatus } from '../generated/prisma/enums.js';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  level: TaskLevel;
  createdAt: Date;
  updatedAt: Date;
}
export type CreateTaskDto = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

// Type helper pour permettre explicitement undefined dans les propriétés optionnelles
// Compatible avec exactOptionalPropertyTypes: true et Zod .partial()
type PartialWithUndefined<T> = {
  [P in keyof T]?: T[P] | undefined;
};

export type UpdateTaskDto = PartialWithUndefined<
  Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
>;
export type TaskResponseDto = Omit<Task, ''>;
export type PublicTaskDto = Pick<Task, 'id' | 'title'>;
export type TaskFilterDto = {
  status?: TaskStatus;
  level?: TaskLevel;
  search?: string;
  sort?: 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};
