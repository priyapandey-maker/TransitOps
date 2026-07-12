import { Request, Response, NextFunction } from 'express';
import { isRequired, isPositiveNumber, isValidDate } from './common.validator';
import { BadRequestError } from '../utils/errors';

export const validateFuel = (req: Request, res: Response, next: NextFunction) => {
  const { vehicle_id, trip_id, liters, cost, date } = req.body;

  if (!isPositiveNumber(vehicle_id)) return next(new BadRequestError('vehicle_id is required and must be a positive number'));
  
  if (trip_id !== undefined && !isPositiveNumber(trip_id)) {
    return next(new BadRequestError('trip_id must be a positive number'));
  }
  if (!isPositiveNumber(liters)) return next(new BadRequestError('liters must be a positive number greater than 0'));
  if (!isPositiveNumber(cost)) return next(new BadRequestError('cost must be a positive number greater than 0'));
  if (!isValidDate(date)) return next(new BadRequestError('date must be a valid date'));

  next();
};
