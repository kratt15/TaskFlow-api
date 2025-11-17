export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
// type pour créer un nouvel utilisateur
export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// type pour mettre à jour un utilisateur
export type UpdateUserDto = Partial< Omit<User, 'id' | 'createdAt' | 'updatedAt'>> & { id: string };