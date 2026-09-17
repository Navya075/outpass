import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Handle known application custom errors
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      errors: err.serializeErrors(),
    });
    return;
  }

  // Handle unhandled server exceptions (HTTP 500)
  console.error('💥 Unhandled Server Exception:', err);
  res.status(500).json({
    success: false,
    errors: [{ message: 'Internal Server Error' }],
  });
};
