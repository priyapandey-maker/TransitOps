import { execute, query, queryOne } from './base.repository';

export interface DriverRow {
  id?: number;
  license_number: string;
  license_expiry: string | Date;
  first_name: string;
  last_name: string;
  phone: string;
  safety_score: number;
  status: 'Available' | 'On Trip' | 'Inactive';
  created_at?: Date;
  updated_at?: Date;
}

export const create = async (driver: DriverRow) => {
  const sql = `
    INSERT INTO drivers (license_number, license_expiry, first_name, last_name, phone, safety_score, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return execute(sql, [
    driver.license_number,
    driver.license_expiry,
    driver.first_name,
    driver.last_name,
    driver.phone,
    driver.safety_score,
    driver.status || 'Available'
  ]);
};

export const findAll = async (limit: number, offset: number) => {
  const sql = `SELECT * FROM drivers ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  return query<DriverRow[]>(sql, [limit.toString(), offset.toString()]);
};

export const findById = async (id: number) => {
  const sql = `SELECT * FROM drivers WHERE id = ?`;
  return queryOne<DriverRow>(sql, [id]);
};

export const findByLicense = async (license: string) => {
  const sql = `SELECT * FROM drivers WHERE license_number = ?`;
  return queryOne<DriverRow>(sql, [license]);
};

export const findByPhone = async (phone: string) => {
  const sql = `SELECT * FROM drivers WHERE phone = ?`;
  return queryOne<DriverRow>(sql, [phone]);
};

export const update = async (id: number, driver: Partial<DriverRow>) => {
  const sql = `
    UPDATE drivers 
    SET license_number = ?, license_expiry = ?, first_name = ?, last_name = ?, phone = ?, safety_score = ?
    WHERE id = ?
  `;
  return execute(sql, [
    driver.license_number,
    driver.license_expiry,
    driver.first_name,
    driver.last_name,
    driver.phone,
    driver.safety_score,
    id
  ]);
};

export const updateStatus = async (id: number, status: string, connection?: any) => {
  const sql = `UPDATE drivers SET status = ? WHERE id = ?`;
  return execute(sql, [status, id], connection);
};
