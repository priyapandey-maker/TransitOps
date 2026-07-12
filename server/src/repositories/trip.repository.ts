import { execute, query, queryOne } from './base.repository';
import { PoolConnection } from 'mysql2/promise';

export interface TripRow {
  id?: number;
  vehicle_id: number;
  driver_id: number;
  origin: string;
  destination: string;
  purpose?: string;
  status?: 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';
  start_time?: Date;
  end_time?: Date;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export const create = async (trip: TripRow) => {
  const sql = `
    INSERT INTO trips (vehicle_id, driver_id, origin, destination, purpose, created_by, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return execute(sql, [
    trip.vehicle_id,
    trip.driver_id,
    trip.origin,
    trip.destination,
    trip.purpose || null,
    trip.created_by,
    trip.status || 'Draft'
  ]);
};

export const findAll = async (limit: number, offset: number) => {
  const sql = `SELECT * FROM trips ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  return query<TripRow[]>(sql, [limit.toString(), offset.toString()]);
};

export const findById = async (id: number) => {
  const sql = `SELECT * FROM trips WHERE id = ?`;
  return queryOne<TripRow>(sql, [id]);
};

export const updateStatus = async (id: number, status: string, connection?: PoolConnection) => {
  const sql = `UPDATE trips SET status = ? WHERE id = ?`;
  return execute(sql, [status, id], connection);
};

export const insertHistory = async (tripId: number, prevStatus: string, newStatus: string, userId: number, connection?: PoolConnection) => {
  const sql = `
    INSERT INTO trip_status_history (trip_id, previous_status, new_status, changed_by)
    VALUES (?, ?, ?, ?)
  `;
  return execute(sql, [tripId, prevStatus, newStatus, userId], connection);
};
