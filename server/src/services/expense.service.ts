import * as expenseRepo from '../repositories/expense.repository';
import * as vehicleRepo from '../repositories/vehicle.repository';
import * as tripRepo from '../repositories/trip.repository';
import { NotFoundError } from '../utils/errors';

export const createExpense = async (data: expenseRepo.ExpenseRow) => {
  if (data.vehicle_id) {
    const vehicle = await vehicleRepo.findById(data.vehicle_id);
    if (!vehicle) throw new NotFoundError('Vehicle not found');
  }

  if (data.trip_id) {
    const trip = await tripRepo.findById(data.trip_id);
    if (!trip) throw new NotFoundError('Trip not found');
  }

  const result = await expenseRepo.create(data);
  return { id: result.insertId, ...data };
};

export const listExpenses = async (limit: number, offset: number) => {
  return expenseRepo.findAll(limit, offset);
};

export const getExpense = async (id: number) => {
  const exp = await expenseRepo.findById(id);
  if (!exp) throw new NotFoundError('Expense not found');
  return exp;
};
