/**
 * Realistic logistics mock data for role‑specific dashboards.
 *
 * Each export provides the exact data shape consumed by
 * the generic DashboardWidgets building blocks.
 */

import type { MetricCardProps, ChartCardProps, TimelineEvent, Alert, TableColumn, TableRow, QuickAction } from '../components/dashboard/DashboardWidgets';
import {
  Truck, Route, Users, Wrench, Fuel,
  DollarSign, Clock, Plus, BarChart3, Shield, FileText,
  Navigation, CheckCircle, TrendingUp, Download,
  Activity, PieChart, CalendarClock, CircleDollarSign,
} from 'lucide-react';

/* ═════════════════════════════════════════════════════
 * Shared palette helpers
 * ═════════════════════════════════════════════════════ */

const iconColors = {
  green: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/40 border border-green-100 dark:border-green-900/30',
  blue: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30',
  purple: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30',
  orange: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/30',
  indigo: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30',
  red: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30',
  teal: 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/30',
  amber: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30',
};

const tripStatusColors = {
  'Dispatched': 'bg-blue-50 text-blue-700 border-blue-200',
  'Completed': 'bg-green-50 text-green-700 border-green-200',
  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
  'Delayed': 'bg-red-50 text-red-700 border-red-200',
  'Draft': 'bg-slate-50 text-slate-600 border-slate-200',
};

const vehicleStatusColors = {
  'Available': 'bg-green-50 text-green-700 border-green-200',
  'On Trip': 'bg-blue-50 text-blue-700 border-blue-200',
  'In Shop': 'bg-orange-50 text-orange-700 border-orange-200',
  'Due Soon': 'bg-amber-50 text-amber-700 border-amber-200',
  'Overdue': 'bg-red-50 text-red-700 border-red-200',
  'Critical': 'bg-red-50 text-red-700 border-red-200',
  'Good': 'bg-green-50 text-green-700 border-green-200',
  'Fair': 'bg-amber-50 text-amber-700 border-amber-200',
};

/* ═════════════════════════════════════════════════════
 * ADMIN DASHBOARD — Business Overview
 * ═════════════════════════════════════════════════════ */

export const adminMetrics: Omit<MetricCardProps, never>[] = [
  { label: 'Fleet Availability',  value: '88%',      subtitle: '42 / 48 vehicles available',   icon: Truck,          iconColor: iconColors.green,  trend: '+3% vs last week', trendDirection: 'up' },
  { label: 'Active Trips',        value: '12',        subtitle: '12 active dispatches today',    icon: Route,          iconColor: iconColors.blue,   trend: '2 more than yesterday', trendDirection: 'up' },
  { label: 'Drivers On Duty',     value: '38',        subtitle: '38 of 45 drivers deployed',     icon: Users,          iconColor: iconColors.purple },
  { label: 'Vehicles In Shop',    value: '4',         subtitle: '4 under maintenance',           icon: Wrench,         iconColor: iconColors.orange, trend: '−1 since yesterday', trendDirection: 'down' },
  { label: 'Revenue Today',       value: '₹3,84,000', subtitle: 'From 8 completed trips',       icon: TrendingUp,     iconColor: iconColors.teal,   trend: '+12% vs avg', trendDirection: 'up' },
  { label: 'Fuel Spend Today',    value: '₹24,500',   subtitle: 'Across 14 refuel logs',         icon: Fuel,           iconColor: iconColors.indigo },
];

export const adminAlerts: Alert[] = [
  { id: 1, severity: 'critical', message: 'Vehicle MH-12-AB-1234 reported high engine temperature warning', time: '12 mins ago' },
  { id: 2, severity: 'warning',  message: 'Driver Rahul Sharma — License Category D renewal due in 4 days', time: '1 hour ago' },
  { id: 3, severity: 'info',     message: 'Scheduled service overdue for MH-14-XY-8899 (truck)', time: '2 hours ago' },
];

export const adminTripColumns: TableColumn[] = [
  { key: 'id', label: 'Trip ID' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'route', label: 'Route' },
  { key: 'load', label: 'Load' },
  { key: 'status', label: 'Status', align: 'right' },
];

export const adminTripRows: TableRow[] = [
  { id: 'TRP-3882', vehicle: 'MH-12-AB-1234', route: 'Pune → Mumbai',       load: '14.2 Tons', status: 'Dispatched' },
  { id: 'TRP-3881', vehicle: 'MH-14-XY-8899', route: 'Mumbai → Nagpur',     load: '18.0 Tons', status: 'Completed' },
  { id: 'TRP-3880', vehicle: 'MH-11-AA-4433', route: 'Chennai → Bengaluru', load: '8.5 Tons',  status: 'In Progress' },
  { id: 'TRP-3879', vehicle: 'MH-04-CD-7712', route: 'Delhi → Jaipur',      load: '22.0 Tons', status: 'Completed' },
];

export const adminTripStatusColors = tripStatusColors;

export const adminFleetChart: ChartCardProps['data'] = [
  { label: 'Available',    value: 42, max: 48, color: 'bg-green-500' },
  { label: 'On Trip',      value: 12, max: 48, color: 'bg-blue-500' },
  { label: 'In Maintenance', value: 4,  max: 48, color: 'bg-orange-500' },
  { label: 'Retired',      value: 2,  max: 48, color: 'bg-slate-400' },
];

export const adminTripCompletionChart: ChartCardProps['data'] = [
  { label: 'Mon', value: 14, max: 20, color: 'bg-primary-500' },
  { label: 'Tue', value: 18, max: 20, color: 'bg-primary-500' },
  { label: 'Wed', value: 11, max: 20, color: 'bg-primary-500' },
  { label: 'Thu', value: 16, max: 20, color: 'bg-primary-500' },
  { label: 'Fri', value: 19, max: 20, color: 'bg-primary-500' },
  { label: 'Sat', value: 8,  max: 20, color: 'bg-primary-400' },
  { label: 'Today', value: 12, max: 20, color: 'bg-primary-600' },
];

export const adminTimeline: TimelineEvent[] = [
  { time: '10:42 AM', actor: 'Admin User',      event: 'Dispatched trip TRP-3882 to Pune→Mumbai corridor' },
  { time: '09:15 AM', actor: 'Dispatcher User',  event: 'Completed trip TRP-3881 — cargo delivered successfully' },
  { time: '08:30 AM', actor: 'Fleet Manager',    event: 'Checked MH-11-AA-4433 into Maintenance Shop for brake inspection' },
  { time: 'Yesterday', actor: 'System',          event: 'Auto-generated monthly fleet utilization report' },
];

export const adminQuickActions: QuickAction[] = [
  { label: 'New Trip',         icon: Plus,       to: '/trips' },
  { label: 'Schedule Service', icon: Wrench,     to: '/maintenance' },
  { label: 'Add Vehicle',      icon: Truck,      to: '/fleet' },
  { label: 'View Reports',     icon: BarChart3,  to: '/analytics' },
];

/* ═════════════════════════════════════════════════════
 * FLEET MANAGER DASHBOARD — Fleet Health
 * ═════════════════════════════════════════════════════ */

export const fleetMetrics: Omit<MetricCardProps, never>[] = [
  { label: 'Fleet Availability',   value: '88%',  subtitle: '42 / 48 vehicles available',       icon: Truck,     iconColor: iconColors.green,  trend: '+3% vs last week', trendDirection: 'up' },
  { label: 'Vehicle Utilization',   value: '76%',  subtitle: 'Average across active fleet',      icon: Activity,  iconColor: iconColors.blue,   trend: 'Optimal range', trendDirection: 'neutral' },
  { label: 'Due for Service',       value: '6',    subtitle: 'Within next 7 days',               icon: CalendarClock, iconColor: iconColors.orange, trend: '+2 since last week', trendDirection: 'up' },
  { label: 'Insurance Expiry',      value: '3',    subtitle: 'Policies expiring within 30 days', icon: Shield,    iconColor: iconColors.red },
  { label: 'Registration Expiry',   value: '1',    subtitle: 'RC renewal due this month',        icon: FileText,  iconColor: iconColors.amber },
  { label: 'Avg Vehicle Health',    value: '92%',  subtitle: 'Fleet health score',               icon: CheckCircle, iconColor: iconColors.teal, trend: 'Good condition', trendDirection: 'up' },
];

export const fleetStatusChart: ChartCardProps['data'] = [
  { label: 'Available',      value: 42, max: 48, color: 'bg-green-500' },
  { label: 'On Trip',        value: 12, max: 48, color: 'bg-blue-500' },
  { label: 'In Maintenance', value: 4,  max: 48, color: 'bg-orange-500' },
  { label: 'Retired',        value: 2,  max: 48, color: 'bg-slate-400' },
];

export const fleetHealthChart: ChartCardProps['data'] = [
  { label: 'Excellent (90–100%)', value: 28, max: 48, color: 'bg-green-500' },
  { label: 'Good (70–89%)',       value: 14, max: 48, color: 'bg-blue-500' },
  { label: 'Fair (50–69%)',       value: 4,  max: 48, color: 'bg-amber-500' },
  { label: 'Poor (<50%)',         value: 2,  max: 48, color: 'bg-red-500' },
];

export const fleetMaintenanceColumns: TableColumn[] = [
  { key: 'id', label: 'Work Order' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'task', label: 'Service Task' },
  { key: 'date', label: 'Scheduled', align: 'right' },
];

export const fleetMaintenanceRows: TableRow[] = [
  { id: 'MNT-092', vehicle: 'MH-12-AB-1234', task: '100K km General Overhaul',         date: 'Jul 15' },
  { id: 'MNT-093', vehicle: 'MH-15-ZZ-9911', task: 'Tire replacement & balancing',     date: 'Jul 17' },
  { id: 'MNT-094', vehicle: 'MH-04-CD-7712', task: 'Brake pad replacement',            date: 'Jul 18' },
  { id: 'MNT-095', vehicle: 'MH-11-AA-4433', task: 'Transmission fluid change',        date: 'Jul 20' },
];

export const fleetAttentionColumns: TableColumn[] = [
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'issue', label: 'Issue' },
  { key: 'health', label: 'Health', align: 'right' },
];

export const fleetAttentionRows: TableRow[] = [
  { vehicle: 'MH-12-AB-1234', issue: 'High engine temperature',         health: 'Critical' },
  { vehicle: 'MH-09-KL-3345', issue: 'Tire pressure sensor fault',      health: 'Fair' },
  { vehicle: 'MH-15-ZZ-9911', issue: 'Oil change overdue by 2,400 km',  health: 'Fair' },
];

export const fleetAttentionStatusColors = vehicleStatusColors;

export const fleetAlerts: Alert[] = [
  { id: 1, severity: 'critical', message: 'MH-12-AB-1234 engine temperature exceeding safe threshold — pull from service', time: '12 mins ago' },
  { id: 2, severity: 'warning',  message: 'Insurance for MH-09-KL-3345 expires in 8 days — renewal pending', time: '3 hours ago' },
  { id: 3, severity: 'warning',  message: 'MH-15-ZZ-9911 oil change overdue — schedule maintenance', time: '5 hours ago' },
];

export const fleetQuickActions: QuickAction[] = [
  { label: 'Add Vehicle',       icon: Plus,       to: '/fleet' },
  { label: 'Schedule Service',  icon: Wrench,     to: '/maintenance' },
  { label: 'Fleet Report',      icon: BarChart3,  to: '/analytics' },
  { label: 'Driver Roster',     icon: Users,      to: '/drivers' },
];

/* ═════════════════════════════════════════════════════
 * DISPATCHER DASHBOARD — Dispatch Command Center
 * ═════════════════════════════════════════════════════ */

export const dispatcherMetrics: Omit<MetricCardProps, never>[] = [
  { label: 'Active Trips',        value: '12',  subtitle: '12 dispatches en route',          icon: Route,       iconColor: iconColors.blue,   trend: '2 more than yesterday', trendDirection: 'up' },
  { label: 'Drivers Available',   value: '7',   subtitle: 'Ready for assignment',             icon: Users,       iconColor: iconColors.green },
  { label: 'Vehicles Available',  value: '9',   subtitle: 'Idle fleet units',                 icon: Truck,       iconColor: iconColors.teal },
  { label: 'Delayed Trips',       value: '2',   subtitle: 'Behind schedule by >30 min',       icon: Clock,       iconColor: iconColors.red,    trend: 'Needs attention', trendDirection: 'down' },
];

export const dispatchQueueColumns: TableColumn[] = [
  { key: 'id', label: 'Trip' },
  { key: 'route', label: 'Route' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'driver', label: 'Driver' },
  { key: 'eta', label: 'ETA', align: 'right' },
  { key: 'status', label: 'Status', align: 'right' },
];

export const dispatchQueueRows: TableRow[] = [
  { id: 'TRP-3882', route: 'Pune → Mumbai',       vehicle: 'MH-12-AB-1234', driver: 'Rahul S.',   eta: '14:30', status: 'In Progress' },
  { id: 'TRP-3883', route: 'Mumbai → Goa',        vehicle: 'MH-04-CD-7712', driver: 'Vikram P.',  eta: '16:45', status: 'Dispatched' },
  { id: 'TRP-3884', route: 'Nagpur → Hyderabad',  vehicle: 'MH-31-EF-5501', driver: 'Amit K.',    eta: '18:00', status: 'Delayed' },
  { id: 'TRP-3885', route: 'Delhi → Chandigarh',  vehicle: 'DL-01-GH-2233', driver: 'Suresh M.',  eta: '12:15', status: 'In Progress' },
  { id: 'TRP-3886', route: 'Bengaluru → Chennai', vehicle: 'KA-05-IJ-8800', driver: 'Pradeep R.', eta: '15:30', status: 'Dispatched' },
];

export const dispatchTripStatusColors = tripStatusColors;

export const dispatchETAChart: ChartCardProps['data'] = [
  { label: 'On Time',     value: 8,  max: 12, color: 'bg-green-500' },
  { label: 'Slight Delay', value: 2, max: 12, color: 'bg-amber-500' },
  { label: 'Significant Delay', value: 2, max: 12, color: 'bg-red-500' },
];

export const dispatchRouteChart: ChartCardProps['data'] = [
  { label: 'Western Corridor',  value: 5, max: 6, color: 'bg-blue-500' },
  { label: 'Southern Corridor', value: 3, max: 6, color: 'bg-indigo-500' },
  { label: 'Northern Corridor', value: 2, max: 6, color: 'bg-purple-500' },
  { label: 'Eastern Corridor',  value: 2, max: 6, color: 'bg-teal-500' },
];

export const dispatcherAlerts: Alert[] = [
  { id: 1, severity: 'critical', message: 'TRP-3884 delayed >45 min — Nagpur→Hyderabad route congestion reported', time: '8 mins ago' },
  { id: 2, severity: 'warning',  message: 'TRP-3885 approaching toll plaza — ETA adjusted by +15 min', time: '22 mins ago' },
  { id: 3, severity: 'info',     message: 'Driver Pradeep R. checked in at Bengaluru depot — ready for dispatch', time: '1 hour ago' },
];

export const dispatcherTimeline: TimelineEvent[] = [
  { time: '10:42 AM', actor: 'System',           event: 'TRP-3882 departed Pune terminal — ETA Mumbai 14:30' },
  { time: '10:15 AM', actor: 'Dispatcher',       event: 'Assigned Vikram P. to TRP-3883 Mumbai→Goa route' },
  { time: '09:50 AM', actor: 'System',           event: 'TRP-3884 flagged as delayed — traffic alert on NH-44' },
  { time: '09:15 AM', actor: 'Driver Suresh M.', event: 'Completed pre-trip inspection for DL-01-GH-2233' },
];

export const dispatcherQuickActions: QuickAction[] = [
  { label: 'New Dispatch',      icon: Plus,       to: '/trips' },
  { label: 'Track Fleet',       icon: Navigation, to: '/fleet' },
  { label: 'Driver Roster',     icon: Users,      to: '/drivers' },
  { label: 'Route Analytics',   icon: BarChart3,  to: '/analytics' },
];

/* ═════════════════════════════════════════════════════
 * FINANCIAL ANALYST DASHBOARD — Cost Analytics
 * ═════════════════════════════════════════════════════ */

export const financeMetrics: Omit<MetricCardProps, never>[] = [
  { label: 'Fuel Spend Today',    value: '₹24,500',   subtitle: 'Across 14 refuel logs',       icon: Fuel,              iconColor: iconColors.indigo, trend: '−8% vs avg', trendDirection: 'down' },
  { label: 'Monthly Fuel Cost',   value: '₹6,42,000', subtitle: 'July 2026 running total',     icon: CircleDollarSign,  iconColor: iconColors.blue },
  { label: 'Maintenance Cost',    value: '₹1,85,000', subtitle: 'July 2026 total',             icon: Wrench,            iconColor: iconColors.orange, trend: '+12% vs June', trendDirection: 'up' },
  { label: 'Cost Per Kilometer',  value: '₹8.40',     subtitle: 'Fleet-wide average',          icon: TrendingUp,        iconColor: iconColors.teal,   trend: '−₹0.30 vs last month', trendDirection: 'down' },
  { label: 'Fleet ROI',           value: '142%',      subtitle: 'Revenue / total cost ratio',  icon: PieChart,          iconColor: iconColors.green,  trend: '+5% QoQ', trendDirection: 'up' },
  { label: 'Operational Cost',    value: '₹12,40,000', subtitle: 'July 2026 all categories',   icon: DollarSign,        iconColor: iconColors.red },
];

export const financeExpenseBreakdown: ChartCardProps['data'] = [
  { label: 'Fuel',            value: 642000, max: 1240000, color: 'bg-indigo-500' },
  { label: 'Maintenance',     value: 185000, max: 1240000, color: 'bg-orange-500' },
  { label: 'Tolls & Permits', value: 98000,  max: 1240000, color: 'bg-purple-500' },
  { label: 'Insurance',       value: 145000, max: 1240000, color: 'bg-blue-500' },
  { label: 'Driver Payroll',  value: 170000, max: 1240000, color: 'bg-teal-500' },
];

export const financeMonthlyCostTrend: ChartCardProps['data'] = [
  { label: 'Jan',  value: 980000,  max: 1400000, color: 'bg-primary-400' },
  { label: 'Feb',  value: 1050000, max: 1400000, color: 'bg-primary-400' },
  { label: 'Mar',  value: 920000,  max: 1400000, color: 'bg-primary-400' },
  { label: 'Apr',  value: 1100000, max: 1400000, color: 'bg-primary-400' },
  { label: 'May',  value: 1180000, max: 1400000, color: 'bg-primary-500' },
  { label: 'Jun',  value: 1150000, max: 1400000, color: 'bg-primary-500' },
  { label: 'Jul',  value: 1240000, max: 1400000, color: 'bg-primary-600' },
];

export const financeExpenseColumns: TableColumn[] = [
  { key: 'category', label: 'Category' },
  { key: 'budgeted', label: 'Budgeted' },
  { key: 'actual', label: 'Actual' },
  { key: 'variance', label: 'Variance', align: 'right' },
];

export const financeExpenseRows: TableRow[] = [
  { category: 'Fuel',            budgeted: '₹7,00,000', actual: '₹6,42,000', variance: '−₹58,000' },
  { category: 'Maintenance',     budgeted: '₹1,50,000', actual: '₹1,85,000', variance: '+₹35,000' },
  { category: 'Tolls & Permits', budgeted: '₹1,00,000', actual: '₹98,000',   variance: '−₹2,000' },
  { category: 'Insurance',       budgeted: '₹1,50,000', actual: '₹1,45,000', variance: '−₹5,000' },
  { category: 'Driver Payroll',  budgeted: '₹1,80,000', actual: '₹1,70,000', variance: '−₹10,000' },
];

export const financeAlerts: Alert[] = [
  { id: 1, severity: 'warning',  message: 'Maintenance budget exceeded by ₹35,000 — corrective repairs spiked', time: '2 hours ago' },
  { id: 2, severity: 'info',     message: 'Fuel costs trending 8% below forecast — route optimization effective', time: '4 hours ago' },
  { id: 3, severity: 'info',     message: 'Q2 financial report ready for review — download available', time: 'Yesterday' },
];

export const financeQuickActions: QuickAction[] = [
  { label: 'Export Report',     icon: Download,   to: '/analytics' },
  { label: 'Fuel Analysis',     icon: Fuel,       to: '/fuel-expenses' },
  { label: 'Cost Trends',       icon: TrendingUp, to: '/analytics' },
  { label: 'Budget Review',     icon: PieChart,   to: '/analytics' },
];

/* ═════════════════════════════════════════════════════
 * Dashboard header metadata
 * ═════════════════════════════════════════════════════ */

export interface DashboardHeaderConfig {
  title: string;
  subtitle: string;
  statusLabel: string;
  statusSeverity: 'normal' | 'warning' | 'critical';
}

export const dashboardHeaders: Record<string, DashboardHeaderConfig> = {
  'Admin': {
    title: 'Operations Command Center',
    subtitle: 'Enterprise-wide fleet operations overview',
    statusLabel: 'All Systems Operational',
    statusSeverity: 'normal',
  },
  'Fleet Manager': {
    title: 'Fleet Health Dashboard',
    subtitle: 'Vehicle health, maintenance, and compliance monitoring',
    statusLabel: '3 Vehicles Need Attention',
    statusSeverity: 'warning',
  },
  'Dispatcher': {
    title: 'Dispatch Command Center',
    subtitle: 'Real-time trip dispatch, tracking, and route management',
    statusLabel: '2 Delayed Trips',
    statusSeverity: 'critical',
  },
  'Financial Analyst': {
    title: 'Financial Analytics',
    subtitle: 'Operational cost tracking, budget analysis, and ROI monitoring',
    statusLabel: 'Budget On Track',
    statusSeverity: 'normal',
  },
};

// --- Additional Role Dashboard Charts ---
export const adminFleetHealthChart: ChartCardProps['data'] = [
  { label: 'Excellent (90–100%)', value: 28, max: 48, color: 'bg-green-500' },
  { label: 'Good (70–89%)',       value: 14, max: 48, color: 'bg-blue-500' },
  { label: 'Fair (50–69%)',       value: 4,  max: 48, color: 'bg-amber-500' },
  { label: 'Poor (<50%)',         value: 2,  max: 48, color: 'bg-red-500' },
];

export const adminActiveTripsChart: ChartCardProps['data'] = [
  { label: 'Pune → Mumbai',       value: 5, max: 6, color: 'bg-blue-500' },
  { label: 'Chennai → Bengaluru', value: 3, max: 6, color: 'bg-indigo-500' },
  { label: 'Delhi → Jaipur',      value: 2, max: 6, color: 'bg-purple-500' },
  { label: 'Mumbai → Goa',        value: 2, max: 6, color: 'bg-teal-500' },
];

export const fleetUtilizationChart: ChartCardProps['data'] = [
  { label: 'Heavy Truck',     value: 24, max: 30, color: 'bg-blue-500' },
  { label: 'Medium Duty',     value: 12, max: 30, color: 'bg-indigo-500' },
  { label: 'Light Commercial', value: 8,  max: 30, color: 'bg-purple-500' },
  { label: 'Passenger SUV',    value: 4,  max: 30, color: 'bg-teal-500' },
];

export const fleetMaintenanceTrendsChart: ChartCardProps['data'] = [
  { label: 'Preventive Service', value: 18, max: 20, color: 'bg-green-500' },
  { label: 'Corrective Repairs', value: 6,  max: 20, color: 'bg-orange-500' },
  { label: 'Diagnostic Check',   value: 4,  max: 20, color: 'bg-blue-500' },
];

export const dispatchLiveQueueChart: ChartCardProps['data'] = [
  { label: 'Active',    value: 12, max: 15, color: 'bg-blue-500' },
  { label: 'Scheduled', value: 4,  max: 15, color: 'bg-indigo-500' },
  { label: 'Staging',   value: 2,  max: 15, color: 'bg-purple-500' },
];

export const dispatchTripCompletionChart: ChartCardProps['data'] = [
  { label: 'Completed', value: 124, max: 150, color: 'bg-green-500' },
  { label: 'Delayed',   value: 6,   max: 150, color: 'bg-amber-500' },
  { label: 'Cancelled', value: 3,   max: 150, color: 'bg-red-500' },
];

export const financeFuelSpendChart: ChartCardProps['data'] = [
  { label: 'Q1 Spend', value: 480000, max: 700000, color: 'bg-indigo-500' },
  { label: 'Q2 Spend', value: 550000, max: 700000, color: 'bg-blue-500' },
  { label: 'Q3 Spend', value: 642000, max: 700000, color: 'bg-purple-500' },
];

export const financeROIChart: ChartCardProps['data'] = [
  { label: 'Tata Signa',   value: 240, max: 250, color: 'bg-green-500' },
  { label: 'Eicher Pro',   value: 239, max: 250, color: 'bg-teal-500' },
  { label: 'Bolero Truck', value: 232, max: 250, color: 'bg-blue-500' },
  { label: 'Super Carry',  value: 210, max: 250, color: 'bg-indigo-500' },
];

