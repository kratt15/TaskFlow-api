export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
// Dto type pour créer un nouvel utilisateur
export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Dto type pour mettre à jour un utilisateur
export type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>> & { id: string };

// Dto pour les reponses api 
export type UserResponseDto = Omit<User, 'password'>;
export type PublicUserDto = Pick<User, 'id' | 'username'>;

//Dto pour l'auth
export type LoginDto = Pick<User, 'email' | 'password'>;
export type RegisterDto = CreateUserDto;

export type AuthResponseDto = {
    user: UserResponseDto;
    token: string;
};