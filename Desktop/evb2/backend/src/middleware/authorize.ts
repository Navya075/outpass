import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../errors/AuthenticationError.js';
import { AuthorizationError } from '../errors/AuthorizationError.js';
import { Role } from '@prisma/client';

export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      return next(new AuthenticationError('Authentication required.'));
    }

    if (!allowedRoles.includes(req.currentUser.role as Role)) {
      return next(
        new AuthorizationError(`Role '${req.currentUser.role}' is not authorized to access this resource.`)
      );
    }

    next();
  };
};
