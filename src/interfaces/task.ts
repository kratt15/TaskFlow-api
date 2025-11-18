export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    level: TaskLevel;
    createdAt: Date;
    updatedAt: Date;
    
}
export enum TaskLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}
export enum TaskStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}
 export type CreateTaskDto = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
 export type UpdateTaskDto = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> & { id: string };
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
 }