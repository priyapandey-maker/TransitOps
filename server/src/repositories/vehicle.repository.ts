import { execute, query, queryOne } from './base.repository';

export interface VehicleRow {
  id?: number;
  registration_number: string;
  make: string;
  model: string;
  year: number;
  capacity: number;
  odometer: number;
  acquisition_cost: number;
  status: 'Available' | 'On Trip' | 'In Shop' | 'Retired';
  created_at?: Date;
  updated_at?: Date;
}

export const create = async (vehicle: VehicleRow) => {
  const sql = `
    INSERT INTO vehicles (registration_number, make, model, year, capacity, odometer, acquisition_cost, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  return execute(sql, [
    vehicle.registration_number,
    vehicle.make,
    vehicle.model,
    vehicle.year,
    vehicle.capacity,
    vehicle.odometer,
    vehicle.acquisition_cost,
    vehicle.status || 'Available'
  ]);
};

export const findAll = async (limit: number, offset: number) => {
  const sql = `SELECT * FROM vehicles ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  return query<VehicleRow[]>(sql, [limit.toString(), offset.toString()]);
};

export const findById = async (id: number) => {
  const sql = `SELECT * FROM vehicles WHERE id = ?`;
  return queryOne<VehicleRow>(sql, [id]);
};

export const findByRegistration = async (registration: string) => {
  const sql = `SELECT * FROM vehicles WHERE registration_number = ?`;
  return queryOne<VehicleRow>(sql, [registration]);
};

export const update = async (id: number, vehicle: Partial<VehicleRow>) => {
  const sql = `
    UPDATE vehicles 
    SET registration_number = ?, make = ?, model = ?, year = ?, capacity = ?, odometer = ?, acquisition_cost = ?
    WHERE id = ?
  `;
  return execute(sql, [
    vehicle.registration_number,
    vehicle.make,
    vehicle.model,
    vehicle.year,
    vehicle.capacity,
    vehicle.odometer,
    vehicle.acquisition_cost,
    id
  ]);
};

export const updateStatus = async (id: number, status: string, connection?: any) => {
  const sql = `UPDATE vehicles SET status = ? WHERE id = ?`;
  return execute(sql, [status, id], connection);
};
