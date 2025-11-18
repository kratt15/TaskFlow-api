export interface Category {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export type CreateCategoryDto = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCategoryDto = Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>> & { id: string };
export type CategoryResponseDto = Category;
export type PublicCategoryDto = Pick<Category, 'id' | 'name'>;
export type CategoryFilterDto = {
    name?: string;
}