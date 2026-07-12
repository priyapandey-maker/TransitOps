import { queryOne } from './base.repository';

export interface UserRow {
  id: number;
  role_id: number;
  role_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  status: string;
}

export const findByEmail = async (email: string): Promise<UserRow | null> => {
  const sql = `
    SELECT u.*, r.name as role_name 
    FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.email = ?
  `;
  return queryOne<UserRow>(sql, [email]);
};

export const findById = async (id: number): Promise<UserRow | null> => {
  const sql = `
    SELECT u.*, r.name as role_name 
    FROM users u 
    JOIN roles r ON u.role_id = r.id 
    WHERE u.id = ?
  `;
  return queryOne<UserRow>(sql, [id]);
};
