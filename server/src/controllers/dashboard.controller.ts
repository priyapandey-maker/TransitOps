import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await dashboardService.getDashboardData();
    return sendSuccess(res, 200, 'Dashboard data retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};
