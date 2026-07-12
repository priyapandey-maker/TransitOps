import { Request, Response, NextFunction } from 'express';
import * as fuelService from '../services/fuel.service';
import { sendSuccess } from '../utils/response';
import { getPagination } from '../utils/sql';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      ...req.body,
      created_by: req.user?.userId
    };
    const result = await fuelService.createFuelLog(data);
    return sendSuccess(res, 201, 'Fuel log created successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const result = await fuelService.listFuelLogs(limit, offset);
    return sendSuccess(res, 200, 'Fuel logs retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await fuelService.getFuelLog(id);
    return sendSuccess(res, 200, 'Fuel log retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};
