import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from './database';
import { User, UserWithoutPassword, JWTPayload, AuthResponse } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const BCRYPT_ROUNDS = 10;

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      return null;
    }
  }

  static async register(email: string, password: string): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = db.createUser(email, passwordHash);

    // Generate token
    const token = this.generateToken(user);

    // Return response without password
    const userWithoutPassword: UserWithoutPassword = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };

    return { token, user: userWithoutPassword };
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    // Find user by email
    const user = db.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    // Return response without password
    const userWithoutPassword: UserWithoutPassword = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };

    return { token, user: userWithoutPassword };
  }
}
