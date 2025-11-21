import type {
  AuthResponseDto,
  CreateUserDto,
  LoginDto,
  User,
  UserResponseDto,
} from "../interfaces/user.js";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export class AuthService {
  async register(data: CreateUserDto): Promise<UserResponseDto> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword as UserResponseDto;
    } catch (error) {
      throw error;
    }
  }

  async login(
    data: LoginDto
  ): Promise<{ user: UserResponseDto; token: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
      const token = this.generateToken(user.id);
      // Retourner l'utilisateur sans le mot de passe
      const { password, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      throw error;
    }
  }
  async getMe(userId: string): Promise<UserResponseDto> {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error("User not found");
      }
      // Retourner l'utilisateur sans le mot de passe
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }
    const expiresIn = process.env.JWT_EXPIRES_IN as string;
    if (!expiresIn) {
      throw new Error("JWT_EXPIRES_IN is not set");
    }
    return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
  }
  verifyToken(token: string): { userId: string } {
    const secret = process.env.JWT_SECRET as string;
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }
    try {
      return jwt.verify(token, secret) as { userId: string };
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}
