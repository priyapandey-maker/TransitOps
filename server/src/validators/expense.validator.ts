import { Request, Response, NextFunction } from 'express';
import { isPositiveNumber, isValidDate } from './common.validator';
import { BadRequestError } from '../utils/errors';

export const validateExpense = (req: Request, res: Response, next: NextFunction) => {
  const { amount, category, date, vehicle_id, trip_id } = req.body;

  if (vehicle_id !== undefined && !isPositiveNumber(vehicle_id)) {
    return next(new BadRequestError('vehicle_id must be a positive number'));
  }
  if (trip_id !== undefined && !isPositiveNumber(trip_id)) {
    return next(new BadRequestError('trip_id must be a positive number'));
  }

  if (!isPositiveNumber(amount)) return next(new BadRequestError('amount must be a positive number greater than 0'));
  if (!isValidDate(date)) return next(new BadRequestError('date must be a valid date'));

  const validCategories = ['Fuel', 'Maintenance', 'Toll', 'Misc'];
  if (!validCategories.includes(category)) {
    return next(new BadRequestError(`Invalid category. Must be one of: ${validCategories.join(', ')}`));
  }

  next();
};
