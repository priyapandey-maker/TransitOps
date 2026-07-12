import { Request, Response, NextFunction } from 'express';
import { isValidEmail, isRequired } from './common.validator';
import { BadRequestError } from '../utils/errors';

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return next(new BadRequestError('Invalid or missing email'));
  }

  if (!isRequired(password)) {
    return next(new BadRequestError('Password is required'));
  }

  next();
};
