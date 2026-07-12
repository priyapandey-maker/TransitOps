import { Request, Response, NextFunction } from 'express';
import * as vehicleService from '../services/vehicle.service';
import { sendSuccess } from '../utils/response';
import { getPagination } from '../utils/sql';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await vehicleService.createVehicle(req.body);
    return sendSuccess(res, 201, 'Vehicle created successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const result = await vehicleService.listVehicles(limit, offset);
    return sendSuccess(res, 200, 'Vehicles retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await vehicleService.getVehicle(id);
    return sendSuccess(res, 200, 'Vehicle retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await vehicleService.updateVehicle(id, req.body);
    return sendSuccess(res, 200, 'Vehicle updated successfully', result);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { status } = req.body;
    const result = await vehicleService.updateStatus(id, status);
    return sendSuccess(res, 200, 'Vehicle status updated successfully', result);
  } catch (error) {
    next(error);
  }
};
