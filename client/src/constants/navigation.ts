/**
 * Sidebar navigation items — locked per UI contract.
 * Exactly 8 items, matching the official mockup.
 */

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export const SIDEBAR_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Fleet', path: '/fleet', icon: 'Truck' },
  { label: 'Drivers', path: '/drivers', icon: 'Users' },
  { label: 'Trips', path: '/trips', icon: 'Route' },
  { label: 'Maintenance', path: '/maintenance', icon: 'Wrench' },
  { label: 'Fuel & Expenses', path: '/fuel-expenses', icon: 'Fuel' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
];

export const SIDEBAR_BOTTOM_NAV: NavItem[] = [
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

export const APP_NAME = 'TransitOps';
export const APP_DESCRIPTION = 'Fleet Management ERP';
