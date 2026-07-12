import { Request, Response, NextFunction } from 'express';
import * as expenseService from '../services/expense.service';
import { sendSuccess } from '../utils/response';
import { getPagination } from '../utils/sql';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      ...req.body,
      created_by: req.user?.userId
    };
    const result = await expenseService.createExpense(data);
    return sendSuccess(res, 201, 'Expense created successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const result = await expenseService.listExpenses(limit, offset);
    return sendSuccess(res, 200, 'Expenses retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const result = await expenseService.getExpense(id);
    return sendSuccess(res, 200, 'Expense retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};
