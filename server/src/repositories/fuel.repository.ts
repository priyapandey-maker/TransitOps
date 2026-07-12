import { execute, query, queryOne } from './base.repository';

export interface FuelRow {
  id?: number;
  vehicle_id: number;
  trip_id?: number | null;
  liters: number;
  cost: number;
  date: Date | string;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export const create = async (fuel: FuelRow) => {
  const sql = `
    INSERT INTO fuel_logs (vehicle_id, trip_id, liters, cost, date, created_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return execute(sql, [
    fuel.vehicle_id,
    fuel.trip_id || null,
    fuel.liters,
    fuel.cost,
    fuel.date,
    fuel.created_by
  ]);
};

export const findAll = async (limit: number, offset: number) => {
  const sql = `SELECT * FROM fuel_logs ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  return query<FuelRow[]>(sql, [limit.toString(), offset.toString()]);
};

export const findById = async (id: number) => {
  const sql = `SELECT * FROM fuel_logs WHERE id = ?`;
  return queryOne<FuelRow>(sql, [id]);
};
