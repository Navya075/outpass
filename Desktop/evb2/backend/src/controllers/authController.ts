import { Request, Response, NextFunction } from 'express';
import { authService, AuthService } from '../services/authService.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';

export class AuthController {
  constructor(private service: AuthService = authService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const result = await this.service.login(email);
      res.status(200).json({
        success: true,
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // Refinement 2: Stateless logout returning HTTP 204 No Content
    res.status(204).send();
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.currentUser) {
        throw new AuthenticationError('Authentication required.');
      }
      const user = await this.service.getCurrentUser(req.currentUser.id);
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
