import { Request, Response, NextFunction } from 'express';
import * as tripService from '../services/trip.service';
import { sendSuccess } from '../utils/response';
import { getPagination } from '../utils/sql';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tripData = {
      ...req.body,
      created_by: req.user?.userId // from authenticate middleware
    };
    const result = await tripService.createTrip(tripData);
    return sendSuccess(res, 201, 'Trip created successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const result = await tripService.listTrips(limit, offset);
    return sendSuccess(res, 200, 'Trips retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await tripService.getTrip(id);
    return sendSuccess(res, 200, 'Trip retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const dispatchTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const userId = req.user?.userId;
    const result = await tripService.dispatchTrip(id, userId);
    return sendSuccess(res, 200, 'Trip dispatched successfully', result);
  } catch (error) {
    next(error);
  }
};

export const completeTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const userId = req.user?.userId;
    const result = await tripService.completeTrip(id, userId);
    return sendSuccess(res, 200, 'Trip completed successfully', result);
  } catch (error) {
    next(error);
  }
};

export const cancelTrip = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const userId = req.user?.userId;
    const result = await tripService.cancelTrip(id, userId);
    return sendSuccess(res, 200, 'Trip cancelled successfully', result);
  } catch (error) {
    next(error);
  }
};
