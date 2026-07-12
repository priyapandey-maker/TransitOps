import pool from '../config/db';
import { PoolConnection, ResultSetHeader } from 'mysql2/promise';

export const query = async <T>(sql: string, params: any[] = [], connection?: PoolConnection): Promise<T> => {
  const db = connection || pool;
  const [rows] = await db.execute(sql, params);
  return rows as T;
};

export const queryOne = async <T>(sql: string, params: any[] = [], connection?: PoolConnection): Promise<T | null> => {
  const rows = await query<T[]>(sql, params, connection);
  if (Array.isArray(rows) && rows.length > 0) {
    return rows[0];
  }
  return null;
};

export const execute = async (sql: string, params: any[] = [], connection?: PoolConnection): Promise<ResultSetHeader> => {
  const db = connection || pool;
  const [result] = await db.execute<ResultSetHeader>(sql, params);
  return result;
};

export const executeTransaction = async <T>(callback: (connection: PoolConnection) => Promise<T>): Promise<T> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
