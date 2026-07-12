/**
 * Common shared types used across the frontend.
 * Enum values match the locked database schema exactly.
 */

/* ── Vehicle ─────────────────────────────────────────── */

export const VEHICLE_STATUSES = ['Available', 'On Trip', 'In Shop', 'Retired'] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const VEHICLE_TYPES = ['Bus', 'Truck', 'Van', 'Car', 'SUV'] as const;
export type VehicleType = (typeof VEHICLE_TYPES)[number];

/* ── Driver ──────────────────────────────────────────── */

export const DRIVER_STATUSES = ['Available', 'On Trip', 'Off Duty', 'Suspended'] as const;
export type DriverStatus = (typeof DRIVER_STATUSES)[number];

export const LICENSE_CATEGORIES = ['A', 'B', 'C', 'D', 'E'] as const;
export type LicenseCategory = (typeof LICENSE_CATEGORIES)[number];

/* ── Trip ────────────────────────────────────────────── */

export const TRIP_STATUSES = ['Draft', 'Dispatched', 'Completed', 'Cancelled'] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];

/* ── Maintenance ─────────────────────────────────────── */

export const MAINTENANCE_STATUSES = ['Open', 'Completed'] as const;
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number];

export const MAINTENANCE_TYPES = ['Preventive', 'Corrective', 'Emergency'] as const;
export type MaintenanceType = (typeof MAINTENANCE_TYPES)[number];

/* ── Expense ─────────────────────────────────────────── */

export const EXPENSE_TYPES = ['Fuel', 'Maintenance', 'Toll', 'Misc'] as const;
export type ExpenseType = (typeof EXPENSE_TYPES)[number];

/* ── User / Auth ─────────────────────────────────────── */

export const USER_STATUSES = ['Active', 'Inactive'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const ROLES = ['Admin', 'Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] as const;
export type Role = (typeof ROLES)[number];

/* ── Pagination ──────────────────────────────────────── */

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* ── Navigation ──────────────────────────────────────── */

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

/* ── Status Badge ────────────────────────────────────── */

export type StatusVariant =
  | 'available'
  | 'on-trip'
  | 'in-shop'
  | 'retired'
  | 'draft'
  | 'dispatched'
  | 'completed'
  | 'cancelled'
  | 'suspended'
  | 'off-duty'
  | 'open'
  | 'active'
  | 'inactive';
