import { execute, query, queryOne } from './base.repository';

export interface ExpenseRow {
  id?: number;
  vehicle_id?: number | null;
  trip_id?: number | null;
  amount: number;
  category: 'Fuel' | 'Maintenance' | 'Toll' | 'Misc';
  description?: string;
  date: Date | string;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export const create = async (expense: ExpenseRow) => {
  const sql = `
    INSERT INTO expenses (vehicle_id, trip_id, amount, category, description, date, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return execute(sql, [
    expense.vehicle_id || null,
    expense.trip_id || null,
    expense.amount,
    expense.category,
    expense.description || null,
    expense.date,
    expense.created_by
  ]);
};

export const findAll = async (limit: number, offset: number) => {
  const sql = `SELECT * FROM expenses ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  return query<ExpenseRow[]>(sql, [limit.toString(), offset.toString()]);
};

export const findById = async (id: number) => {
  const sql = `SELECT * FROM expenses WHERE id = ?`;
  return queryOne<ExpenseRow>(sql, [id]);
};
