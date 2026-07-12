import { Request, Response, NextFunction } from 'express';
import * as maintService from '../services/maintenance.service';
import { sendSuccess } from '../utils/response';
import { getPagination } from '../utils/sql';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      ...req.body,
      created_by: req.user?.userId
    };
    const result = await maintService.createMaintenance(data);
    return sendSuccess(res, 201, 'Maintenance record created successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const result = await maintService.listMaintenance(limit, offset);
    return sendSuccess(res, 200, 'Maintenance records retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await maintService.getMaintenance(id);
    return sendSuccess(res, 200, 'Maintenance record retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const closeMaintenance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await maintService.closeMaintenance(id);
    return sendSuccess(res, 200, 'Maintenance record closed successfully', result);
  } catch (error) {
    next(error);
  }
};
