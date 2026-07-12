import { Request, Response, NextFunction } from 'express';
import { isRequired, isPositiveNumber } from './common.validator';
import { BadRequestError } from '../utils/errors';

export const validateCreateTrip = (req: Request, res: Response, next: NextFunction) => {
  const { vehicle_id, driver_id, origin, destination } = req.body;

  if (!isPositiveNumber(vehicle_id)) return next(new BadRequestError('vehicle_id is required and must be a positive number'));
  if (!isPositiveNumber(driver_id)) return next(new BadRequestError('driver_id is required and must be a positive number'));
  
  if (!isRequired(origin)) return next(new BadRequestError('origin is required'));
  if (!isRequired(destination)) return next(new BadRequestError('destination is required'));

  next();
};
