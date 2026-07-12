import { z } from 'zod';
import type { Role } from './common.types';

// Zod Schema for Login Validation
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

// User object structure returned by auth endpoints
export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  role: Role;
}

// Responses from APIs
export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ProfileResponse {
  user: AuthUser;
}
