import jwt, { Algorithm } from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthenticationError } from '../errors/AuthenticationError.js';

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
  role: 'VIEWER' | 'AUTHOR' | 'REVIEWER' | 'ADMIN';
}

export const generateToken = (payload: AuthUserPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
    algorithm: env.JWT_ALGORITHM as Algorithm,
  });
};

export const verifyToken = (token: string): AuthUserPayload => {
  try {
    return jwt.verify(token, env.JWT_SECRET, {
      algorithms: [env.JWT_ALGORITHM as Algorithm],
    }) as AuthUserPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired authentication token.');
  }
};

export const decodeToken = (token: string): AuthUserPayload | null => {
  return jwt.decode(token) as AuthUserPayload | null;
};
