import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { env } from '../config/env';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle known HTTP AppErrors securely
  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  // Log unexpected errors
  console.error('[Unexpected Error]', err);

  // Mask unexpected error details in production to prevent leakage
  const message = env.NODE_ENV === 'production' ? 'Internal Server Error' : (err.message || 'Unknown Error');
  return sendError(res, 500, message);
};
