import { Request, Response, NextFunction } from 'express';
import * as driverService from '../services/driver.service';
import { sendSuccess } from '../utils/response';
import { getPagination } from '../utils/sql';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await driverService.createDriver(req.body);
    return sendSuccess(res, 201, 'Driver created successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const result = await driverService.listDrivers(limit, offset);
    return sendSuccess(res, 200, 'Drivers retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await driverService.getDriver(id);
    return sendSuccess(res, 200, 'Driver retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await driverService.updateDriver(id, req.body);
    return sendSuccess(res, 200, 'Driver updated successfully', result);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { status } = req.body;
    const result = await driverService.updateStatus(id, status);
    return sendSuccess(res, 200, 'Driver status updated successfully', result);
  } catch (error) {
    next(error);
  }
};
