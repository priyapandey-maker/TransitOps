import { execute, query, queryOne } from './base.repository';
import { PoolConnection } from 'mysql2/promise';

export interface MaintenanceRow {
  id?: number;
  vehicle_id: number;
  description: string;
  cost: number;
  start_date: Date | string;
  end_date?: Date | string | null;
  status?: 'Open' | 'Closed';
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export const create = async (maint: MaintenanceRow, connection?: PoolConnection) => {
  const sql = `
    INSERT INTO maintenance_logs (vehicle_id, description, cost, start_date, created_by, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return execute(sql, [
    maint.vehicle_id,
    maint.description,
    maint.cost,
    maint.start_date,
    maint.created_by,
    maint.status || 'Open'
  ], connection);
};

export const findAll = async (limit: number, offset: number) => {
  const sql = `SELECT * FROM maintenance_logs ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  return query<MaintenanceRow[]>(sql, [limit.toString(), offset.toString()]);
};

export const findById = async (id: number) => {
  const sql = `SELECT * FROM maintenance_logs WHERE id = ?`;
  return queryOne<MaintenanceRow>(sql, [id]);
};

export const findOpenByVehicleId = async (vehicleId: number) => {
  const sql = `SELECT * FROM maintenance_logs WHERE vehicle_id = ? AND status = 'Open'`;
  return queryOne<MaintenanceRow>(sql, [vehicleId]);
};

export const updateStatusAndEndDate = async (id: number, status: string, endDate: string, connection?: PoolConnection) => {
  const sql = `UPDATE maintenance_logs SET status = ?, end_date = ? WHERE id = ?`;
  return execute(sql, [status, endDate, id], connection);
};
