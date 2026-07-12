/**
 * DashboardPage — Role‑aware Operations Command Center.
 *
 * A single component that renders different widget layouts
 * depending on the authenticated user's role:
 *   • Admin         → Business overview
 *   • Fleet Manager → Fleet health & maintenance
 *   • Dispatcher    → Dispatch command center
 *   • Financial Analyst → Cost analytics
 *
 * Uses six generic building blocks from DashboardWidgets.tsx.
 * All data sourced from dashboardData.ts (realistic mock data).
 */

import { useAuth } from '../context/AuthContext';
import type { Role } from '../types/common.types';
import {
  MetricCard,
  ChartCard,
  TimelineCard,
  AlertCard,
  TableCard,
  QuickActionsCard,
} from '../components/dashboard/DashboardWidgets';
import type { MetricCardProps } from '../components/dashboard/DashboardWidgets';
import { Truck, BarChart3, Route, Clock, Wrench, Fuel } from 'lucide-react';

/* ── Import role‑specific data ───────────────────────── */
import {
  dashboardHeaders,
  // Admin
  adminMetrics, adminAlerts, adminTripColumns, adminTripRows, adminTripStatusColors,
  adminFleetChart, adminTripCompletionChart, adminTimeline, adminQuickActions,
  adminFleetHealthChart, adminActiveTripsChart,
  // Fleet Manager
  fleetMetrics, fleetStatusChart, fleetHealthChart,
  fleetMaintenanceColumns, fleetMaintenanceRows,
  fleetAttentionColumns, fleetAttentionRows, fleetAttentionStatusColors,
  fleetAlerts, fleetQuickActions,
  fleetUtilizationChart, fleetMaintenanceTrendsChart,
  // Dispatcher
  dispatcherMetrics, dispatchQueueColumns, dispatchQueueRows, dispatchTripStatusColors,
  dispatchETAChart, dispatchRouteChart, dispatcherAlerts, dispatcherTimeline, dispatcherQuickActions,
  dispatchLiveQueueChart, dispatchTripCompletionChart,
  // Financial
  financeMetrics, financeExpenseBreakdown, financeMonthlyCostTrend,
  financeExpenseColumns, financeExpenseRows, financeAlerts, financeQuickActions,
  financeFuelSpendChart, financeROIChart,
} from '../constants/dashboardData';

/* ═════════════════════════════════════════════════════
 * Status badge component
 * ═════════════════════════════════════════════════════ */

function StatusBadge({ label, severity }: { label: string; severity: 'normal' | 'warning' | 'critical' }) {
  const styles = {
    normal: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30',
    warning: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/30',
    critical: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30',
  };
  const dots = {
    normal: 'bg-green-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[severity]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[severity]} ${severity === 'critical' ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  );
}

/* ═════════════════════════════════════════════════════
 * KPI Grid — reusable metric row
 * ═════════════════════════════════════════════════════ */

function MetricsGrid({ metrics }: { metrics: Omit<MetricCardProps, never>[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  );
}

/* ═════════════════════════════════════════════════════
 * Admin layout
 * ═════════════════════════════════════════════════════ */

function AdminDashboard() {
  return (
    <>
      <MetricsGrid metrics={adminMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          <AlertCard title="Priority Alerts" alerts={adminAlerts} />
          <TableCard
            title="Recent Trips & Dispatch Log"
            icon={Route}
            columns={adminTripColumns}
            rows={adminTripRows}
            viewAllLink="/trips"
            statusColumn="status"
            statusColors={adminTripStatusColors}
          />
        </div>

        {/* Right 1/3 */}
        <div className="space-y-8">
          <QuickActionsCard title="Quick Dispatch Controls" actions={adminQuickActions} />
          <ChartCard title="Fleet Availability" icon={Truck} data={adminFleetChart} />
          <ChartCard title="Fleet Health Index" icon={BarChart3} data={adminFleetHealthChart} />
          <ChartCard title="Active Trip Corridors" icon={Route} data={adminActiveTripsChart} />
          <ChartCard title="Overall Trip Completions" icon={BarChart3} data={adminTripCompletionChart} />
          <TimelineCard title="Command Logs" events={adminTimeline} />
        </div>
      </div>
    </>
  );
}

/* ═════════════════════════════════════════════════════
 * Fleet Manager layout
 * ═════════════════════════════════════════════════════ */

function FleetManagerDashboard() {
  return (
    <>
      <MetricsGrid metrics={fleetMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AlertCard title="Fleet Alerts" alerts={fleetAlerts} />
          <TableCard
            title="Upcoming Maintenance Schedule"
            icon={Clock}
            columns={fleetMaintenanceColumns}
            rows={fleetMaintenanceRows}
            viewAllLink="/maintenance"
          />
          <TableCard
            title="Vehicles Requiring Attention"
            icon={Truck}
            columns={fleetAttentionColumns}
            rows={fleetAttentionRows}
            statusColumn="health"
            statusColors={fleetAttentionStatusColors}
          />
        </div>

        <div className="space-y-8">
          <QuickActionsCard title="Fleet Quick Actions" actions={fleetQuickActions} />
          <ChartCard title="Vehicle Class Utilization" icon={Truck} data={fleetUtilizationChart} />
          <ChartCard title="Maintenance Job Trends" icon={Wrench} data={fleetMaintenanceTrendsChart} />
          <ChartCard title="Fleet Health Status" icon={BarChart3} data={fleetHealthChart} />
          <ChartCard title="Upcoming Service Status" icon={Truck} data={fleetStatusChart} />
        </div>
      </div>
    </>
  );
}

/* ═════════════════════════════════════════════════════
 * Dispatcher layout
 * ═════════════════════════════════════════════════════ */

function DispatcherDashboard() {
  return (
    <>
      <MetricsGrid metrics={dispatcherMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AlertCard title="Priority Dispatch Alerts" alerts={dispatcherAlerts} />
          <TableCard
            title="Live Dispatch Queue"
            icon={Route}
            columns={dispatchQueueColumns}
            rows={dispatchQueueRows}
            viewAllLink="/trips"
            statusColumn="status"
            statusColors={dispatchTripStatusColors}
          />
          <TimelineCard title="Dispatch Activity Log" events={dispatcherTimeline} />
        </div>

        <div className="space-y-8">
          <QuickActionsCard title="Dispatch Quick Actions" actions={dispatcherQuickActions} />
          <ChartCard title="Live Dispatch Status" icon={Route} data={dispatchLiveQueueChart} />
          <ChartCard title="Trip Completion Rates" icon={BarChart3} data={dispatchTripCompletionChart} />
          <ChartCard title="ETA Delay Performance" icon={Clock} data={dispatchETAChart} />
          <ChartCard title="Delayed Route Segments" icon={Route} data={dispatchRouteChart} />
        </div>
      </div>
    </>
  );
}

/* ═════════════════════════════════════════════════════
 * Financial Analyst layout
 * ═════════════════════════════════════════════════════ */

function FinancialAnalystDashboard() {
  return (
    <>
      <MetricsGrid metrics={financeMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AlertCard title="Budget Alerts" alerts={financeAlerts} />
          <TableCard
            title="Expense Categories vs Budget"
            icon={BarChart3}
            columns={financeExpenseColumns}
            rows={financeExpenseRows}
          />
        </div>

        <div className="space-y-8">
          <QuickActionsCard title="Finance Quick Actions" actions={financeQuickActions} />
          <ChartCard title="Quarterly Fuel Spend" icon={Fuel} data={financeFuelSpendChart} />
          <ChartCard title="Monthly Operational Costs" icon={BarChart3} data={financeMonthlyCostTrend} />
          <ChartCard title="Capital Asset ROI Index" icon={BarChart3} data={financeROIChart} />
          <ChartCard title="Monthly Expense Breakdown" icon={BarChart3} data={financeExpenseBreakdown} />
        </div>
      </div>
    </>
  );
}

/* ═════════════════════════════════════════════════════
 * Main DashboardPage — role router
 * ═════════════════════════════════════════════════════ */

const DASHBOARD_MAP: Record<Role, React.FC> = {
  'Admin': AdminDashboard,
  'Fleet Manager': FleetManagerDashboard,
  'Dispatcher': DispatcherDashboard,
  'Financial Analyst': FinancialAnalystDashboard,
  'Safety Officer': AdminDashboard, // fallback to Admin view
};

export default function DashboardPage() {
  const { userRole } = useAuth();
  const role: Role = userRole ?? 'Admin';

  const defaultHeader = { title: 'Operations Command Center', subtitle: 'Enterprise-wide fleet operations overview', statusLabel: 'All Systems Operational', statusSeverity: 'normal' as const };
  const header = dashboardHeaders[role] ?? defaultHeader;
  const DashboardContent = DASHBOARD_MAP[role] ?? AdminDashboard;

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Role‑specific header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {header.title}
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            {header.subtitle}
          </p>
        </div>
        <StatusBadge label={header.statusLabel} severity={header.statusSeverity} />
      </div>

      {/* Role‑specific content */}
      <DashboardContent />
    </div>
  );
}
