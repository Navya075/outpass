import { Request, Response, NextFunction } from 'express';
import { verifyToken, AuthUserPayload } from '../utils/jwt.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';

declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthUserPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Authentication token required.'));
  }

  const token = authHeader.substring(7).trim();

  if (!token) {
    return next(new AuthenticationError('Authentication token required.'));
  }

  try {
    const payload = verifyToken(token);
    req.currentUser = payload;
    next();
  } catch (error) {
    next(error);
  }
};
