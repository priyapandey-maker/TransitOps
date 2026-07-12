import { Request, Response, NextFunction } from 'express';
import { isRequired, isValidDate } from './common.validator';
import { BadRequestError } from '../utils/errors';

export const validateDriver = (req: Request, res: Response, next: NextFunction) => {
  const { license_number, license_expiry, first_name, last_name, phone, safety_score } = req.body;

  if (!isRequired(license_number)) return next(new BadRequestError('license_number is required'));
  if (!isRequired(first_name)) return next(new BadRequestError('first_name is required'));
  if (!isRequired(last_name)) return next(new BadRequestError('last_name is required'));
  if (!isRequired(phone)) return next(new BadRequestError('phone is required'));
  
  if (!isValidDate(license_expiry)) return next(new BadRequestError('license_expiry must be a valid date'));

  if (safety_score !== undefined) {
    const score = Number(safety_score);
    if (isNaN(score) || score < 0 || score > 100) {
      return next(new BadRequestError('safety_score must be a number between 0 and 100'));
    }
  }

  next();
};

export const validateDriverStatus = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const validStatuses = ['Available', 'On Trip', 'Inactive'];
  
  if (!validStatuses.includes(status)) {
    return next(new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`));
  }
  next();
};
