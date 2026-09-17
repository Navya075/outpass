import { userRepository, UserRepository } from '../repositories/userRepository.js';
import { generateToken, AuthUserPayload } from '../utils/jwt.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { User, Role } from '@prisma/client';

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async login(email: string): Promise<{ token: string; user: AuthUserPayload }> {
    const user = await this.userRepo.findByEmail(email);

    // Uniform failure protection: Do not expose user existence (return 401 Invalid credentials)
    if (!user) {
      throw new AuthenticationError('Invalid credentials.');
    }

    const payload: AuthUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
    };

    const token = generateToken(payload);

    return {
      token,
      user: payload,
    };
  }

  async getCurrentUser(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);

    // Refinement 1: If JWT is valid but user no longer exists in DB, return 401 "Session is no longer valid."
    if (!user) {
      throw new AuthenticationError('Session is no longer valid.');
    }

    return user;
  }
}

export const authService = new AuthService();
