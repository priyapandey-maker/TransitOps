import { Request, Response, NextFunction } from 'express';
import { isRequired, isPositiveNumber, isNonNegativeNumber } from './common.validator';
import { BadRequestError } from '../utils/errors';

export const validateVehicle = (req: Request, res: Response, next: NextFunction) => {
  const { registration_number, make, model, year, capacity, odometer, acquisition_cost } = req.body;

  if (!isRequired(registration_number)) return next(new BadRequestError('registration_number is required'));
  if (!isRequired(make)) return next(new BadRequestError('make is required'));
  if (!isRequired(model)) return next(new BadRequestError('model is required'));
  
  const y = Number(year);
  if (isNaN(y) || y < 1990) return next(new BadRequestError('year must be 1990 or later'));
  
  if (!isPositiveNumber(capacity)) return next(new BadRequestError('capacity must be a positive number greater than 0'));
  if (!isNonNegativeNumber(odometer)) return next(new BadRequestError('odometer must be a non-negative number'));
  if (!isNonNegativeNumber(acquisition_cost)) return next(new BadRequestError('acquisition_cost must be a non-negative number'));

  next();
};

export const validateVehicleStatus = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  const validStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
  
  if (!validStatuses.includes(status)) {
    return next(new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`));
  }
  next();
};
