/**
 * Sidebar navigation items — role‑aware configuration.
 * Each role sees only the modules relevant to their responsibilities.
 */

import type { Role } from '../types/common.types';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

/* ── Full navigation catalogue ───────────────────────── */

const NAV_DASHBOARD: NavItem  = { label: 'Dashboard',       path: '/dashboard',      icon: 'LayoutDashboard' };
const NAV_FLEET: NavItem      = { label: 'Fleet',           path: '/fleet',          icon: 'Truck' };
const NAV_DRIVERS: NavItem    = { label: 'Drivers',         path: '/drivers',        icon: 'Users' };
const NAV_TRIPS: NavItem      = { label: 'Trips',           path: '/trips',          icon: 'Route' };
const NAV_MAINTENANCE: NavItem = { label: 'Maintenance',    path: '/maintenance',    icon: 'Wrench' };
const NAV_FUEL: NavItem       = { label: 'Fuel & Expenses', path: '/fuel-expenses',  icon: 'Fuel' };
const NAV_ANALYTICS: NavItem  = { label: 'Analytics',       path: '/analytics',      icon: 'BarChart3' };

/* ── Role → sidebar mapping ──────────────────────────── */

export const ROLE_NAV: Record<Role, NavItem[]> = {
  'Admin': [
    NAV_DASHBOARD,
    NAV_FLEET,
    NAV_DRIVERS,
    NAV_TRIPS,
    NAV_MAINTENANCE,
    NAV_FUEL,
    NAV_ANALYTICS,
  ],
  'Fleet Manager': [
    NAV_DASHBOARD,
    NAV_FLEET,
    NAV_MAINTENANCE,
    NAV_DRIVERS,
    NAV_ANALYTICS,
  ],
  'Dispatcher': [
    NAV_DASHBOARD,
    NAV_TRIPS,
    NAV_DRIVERS,
    NAV_FLEET,
  ],
  'Financial Analyst': [
    NAV_DASHBOARD,
    NAV_FUEL,
    NAV_ANALYTICS,
    NAV_MAINTENANCE,
  ],
  'Safety Officer': [
    NAV_DASHBOARD,
    NAV_DRIVERS,
    NAV_FLEET,
    NAV_MAINTENANCE,
  ],
};

/** Backward-compatible full list (Admin sees everything) */
export const SIDEBAR_NAV: NavItem[] = ROLE_NAV['Admin'];

export const SIDEBAR_BOTTOM_NAV: NavItem[] = [
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

export const APP_NAME = 'TransitOps';
export const APP_DESCRIPTION = 'Fleet Management ERP';
