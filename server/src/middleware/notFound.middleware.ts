import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  return sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
};
