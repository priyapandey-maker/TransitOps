import { Request, Response, NextFunction } from 'express';
import { isRequired, isPositiveNumber, isValidDate } from './common.validator';
import { BadRequestError } from '../utils/errors';

export const validateMaintenance = (req: Request, res: Response, next: NextFunction) => {
  const { vehicle_id, description, cost, start_date } = req.body;

  if (!isPositiveNumber(vehicle_id)) return next(new BadRequestError('vehicle_id is required and must be a positive number'));
  if (!isRequired(description)) return next(new BadRequestError('description is required'));
  if (!isPositiveNumber(cost)) return next(new BadRequestError('cost must be a positive number greater than 0'));
  if (!isValidDate(start_date)) return next(new BadRequestError('start_date must be a valid date'));

  next();
};
