import mysql from 'mysql2/promise';
import { env } from './env';

const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const checkDbConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('[Database] MySQL connection established successfully');
    connection.release();
  } catch (error) {
    console.error('[Database] MySQL connection failed:', error);
  }
};

export default pool;
