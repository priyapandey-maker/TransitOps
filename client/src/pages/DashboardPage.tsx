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
import { Truck, BarChart3, Route, Clock, Wrench, Fuel, Download } from 'lucide-react';
import { exportToPdf } from '../utils/pdfExport';
import { useState, useEffect, useMemo } from 'react';
import { getDashboardData, type DashboardData } from '../services/dashboard.api';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';

/* ── Import role‑specific data ───────────────────────── */
import {
  dashboardHeaders,
  // Admin
  adminMetrics, adminAlerts, adminTripColumns, adminTripRows, adminTripStatusColors,
   adminTimeline, adminQuickActions,
  
  // Fleet Manager
  fleetMetrics, 
  fleetMaintenanceColumns, fleetMaintenanceRows,
  fleetAttentionColumns, fleetAttentionRows, fleetAttentionStatusColors,
  fleetAlerts, fleetQuickActions,
  
  // Dispatcher
  dispatcherMetrics, dispatchQueueColumns, dispatchQueueRows, dispatchTripStatusColors,
  dispatcherAlerts, dispatcherTimeline, dispatcherQuickActions,
  // Financial
  financeMetrics,
  financeExpenseColumns, financeExpenseRows, financeAlerts, financeQuickActions,
  
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

function AdminDashboard({ data }: { data: DashboardData | null }) {
  const dynamicMetrics = useMemo(() => {
    if (!data) return adminMetrics;
    const { fleetSummary, tripSummary, driverSummary, fuelSummary } = data;
    return adminMetrics.map(m => {
      if (m.label === 'Fleet Availability') return { ...m, value: `${Math.round((fleetSummary.available_vehicles / (fleetSummary.total_vehicles || 1)) * 100)}%`, subtitle: `${fleetSummary.available_vehicles} / ${fleetSummary.total_vehicles} vehicles available` };
      if (m.label === 'Active Trips') return { ...m, value: String(tripSummary.dispatched_trips), subtitle: `${tripSummary.dispatched_trips} active dispatches today` };
      if (m.label === 'Drivers On Duty') return { ...m, value: String(driverSummary.on_trip_drivers + driverSummary.available_drivers), subtitle: `${driverSummary.on_trip_drivers + driverSummary.available_drivers} of ${driverSummary.total_drivers} drivers deployed` };
      if (m.label === 'Vehicles In Shop') return { ...m, value: String(fleetSummary.in_shop_vehicles), subtitle: `${fleetSummary.in_shop_vehicles} under maintenance` };
      if (m.label === 'Fuel Spend Today') return { ...m, value: `₹${fuelSummary.total_fuel_cost.toLocaleString()}`, subtitle: `Across ${fuelSummary.total_fuel_records} refuel logs` };
      return m;
    });
  }, [data]);

  const dynamicTripRows = useMemo(() => {
    if (!data) return adminTripRows;
    return data.recentTrips.map(t => ({
      id: `TRP-${t.trip_id}`,
      vehicle: t.registration_number,
      route: `${t.origin} → ${t.destination}`,
      load: 'Standard',
      status: t.status
    }));
  }, [data]);

  const dynamicActiveTripsChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Dispatched', value: data.tripSummary.dispatched_trips, color: 'bg-blue-500' },
      { label: 'Completed', value: data.tripSummary.completed_trips, color: 'bg-green-500' }
    ];
  }, [data]);

  const dynamicFleetChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Available', value: data.fleetSummary.available_vehicles, color: 'bg-green-500' },
      { label: 'On Trip', value: data.fleetSummary.on_trip_vehicles, color: 'bg-blue-500' },
      { label: 'In Shop', value: data.fleetSummary.in_shop_vehicles, color: 'bg-orange-500' },
      { label: 'Retired', value: data.fleetSummary.retired_vehicles, color: 'bg-slate-400' },
    ];
  }, [data]);

  const dynamicFleetHealthChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Healthy', value: data.fleetSummary.total_vehicles - data.maintenanceSummary.open_maintenance, color: 'bg-green-500' },
      { label: 'Needs Repair', value: data.maintenanceSummary.open_maintenance, color: 'bg-orange-500' }
    ];
  }, [data]);

  const dynamicTripCompletionChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Draft', value: data.tripSummary.draft_trips, color: 'bg-slate-400' },
      { label: 'Dispatched', value: data.tripSummary.dispatched_trips, color: 'bg-blue-500' },
      { label: 'Completed', value: data.tripSummary.completed_trips, color: 'bg-green-500' },
      { label: 'Cancelled', value: data.tripSummary.cancelled_trips, color: 'bg-red-500' },
    ];
  }, [data]);

  return (
    <>
      <MetricsGrid metrics={dynamicMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-8">
          <AlertCard title="Priority Alerts" alerts={adminAlerts} />
          <TableCard
            title="Recent Trips & Dispatch Log"
            icon={Route}
            columns={adminTripColumns}
            rows={dynamicTripRows}
            viewAllLink="/trips"
            statusColumn="status"
            statusColors={adminTripStatusColors}
          />
          <ChartCard title="Overall Trip Completions" icon={BarChart3} data={dynamicTripCompletionChart} />
        </div>

        {/* Right 1/3 */}
        <div className="space-y-8">
          <QuickActionsCard title="Quick Dispatch Controls" actions={adminQuickActions} />
          <ChartCard title="Active Trip Corridors" icon={Route} data={dynamicActiveTripsChart} />
          <ChartCard title="Fleet Availability" icon={Truck} data={dynamicFleetChart} />
          <ChartCard title="Fleet Health Index" icon={BarChart3} data={dynamicFleetHealthChart} />
          <TimelineCard title="Command Logs" events={adminTimeline} />
        </div>
      </div>
    </>
  );
}

/* ═════════════════════════════════════════════════════
 * Fleet Manager layout
 * ═════════════════════════════════════════════════════ */


function FleetManagerDashboard({ data }: { data: DashboardData | null }) {
  const dynamicMetrics = useMemo(() => {
    if (!data) return fleetMetrics;
    const { fleetSummary, maintenanceSummary } = data;
    return fleetMetrics.map(m => {
      if (m.label === 'Active Vehicles') return { ...m, value: String(fleetSummary.available_vehicles + fleetSummary.on_trip_vehicles), subtitle: `${fleetSummary.available_vehicles} idle, ${fleetSummary.on_trip_vehicles} en route` };
      if (m.label === 'Fleet Utilization') return { ...m, value: `${Math.round(((fleetSummary.on_trip_vehicles) / (fleetSummary.total_vehicles || 1)) * 100)}%`, subtitle: 'Target: >75%' };
      if (m.label === 'Pending Maintenance') return { ...m, value: String(maintenanceSummary.open_maintenance), subtitle: `${maintenanceSummary.open_maintenance} vehicles in shop` };
      return m;
    });
  }, [data]);

  const dynamicFleetStatusChart = useMemo(() => {
    if (!data) return [];
    const { fleetSummary } = data;
    return [
      { label: 'Available', value: fleetSummary.available_vehicles, color: 'bg-green-500' },
      { label: 'On Trip', value: fleetSummary.on_trip_vehicles, color: 'bg-blue-500' },
      { label: 'In Shop', value: fleetSummary.in_shop_vehicles, color: 'bg-orange-500' },
      { label: 'Retired', value: fleetSummary.retired_vehicles, color: 'bg-slate-400' },
    ];
  }, [data]);

  const dynamicHealthChart = useMemo(() => {
    if (!data) return [];
    const { maintenanceSummary } = data;
    return [
      { label: 'Healthy', value: data.fleetSummary.total_vehicles - maintenanceSummary.open_maintenance, color: 'bg-green-500' },
      { label: 'Needs Repair', value: maintenanceSummary.open_maintenance, color: 'bg-orange-500' },
    ];
  }, [data]);

  const dynamicUtilizationChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Utilized', value: data.fleetSummary.on_trip_vehicles, color: 'bg-blue-500' },
      { label: 'Idle', value: data.fleetSummary.available_vehicles, color: 'bg-slate-400' }
    ];
  }, [data]);

  const dynamicMaintenanceTrendsChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Open', value: data.maintenanceSummary.open_maintenance, color: 'bg-orange-500' },
      { label: 'Closed', value: data.maintenanceSummary.closed_maintenance, color: 'bg-green-500' }
    ];
  }, [data]);

  return (
    <>
      <MetricsGrid metrics={dynamicMetrics} />

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
          <ChartCard title="Fleet Health Status" icon={BarChart3} data={dynamicHealthChart} />
          <ChartCard title="Upcoming Service Status" icon={Truck} data={dynamicFleetStatusChart} />
        </div>

        <div className="space-y-8">
          <QuickActionsCard title="Fleet Quick Actions" actions={fleetQuickActions} />
          <ChartCard title="Vehicle Class Utilization" icon={Truck} data={dynamicUtilizationChart} />
          <ChartCard title="Maintenance Job Trends" icon={Wrench} data={dynamicMaintenanceTrendsChart} />
        </div>
      </div>
    </>
  );
}


/* ═════════════════════════════════════════════════════
 * Dispatcher layout
 * ═════════════════════════════════════════════════════ */


function DispatcherDashboard({ data }: { data: DashboardData | null }) {
  const dynamicMetrics = useMemo(() => {
    if (!data) return dispatcherMetrics;
    const { tripSummary, driverSummary } = data;
    return dispatcherMetrics.map(m => {
      if (m.label === 'Active Dispatches') return { ...m, value: String(tripSummary.dispatched_trips) };
      if (m.label === 'Drivers On Duty') return { ...m, value: String(driverSummary.on_trip_drivers) };
      if (m.label === 'Trips Completed') return { ...m, value: String(tripSummary.completed_trips) };
      return m;
    });
  }, [data]);

  const dynamicLiveQueueChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Draft', value: data.tripSummary.draft_trips, color: 'bg-slate-400' },
      { label: 'Dispatched', value: data.tripSummary.dispatched_trips, color: 'bg-blue-500' },
    ];
  }, [data]);

  const dynamicTripCompletionChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Completed', value: data.tripSummary.completed_trips, color: 'bg-green-500' },
      { label: 'Cancelled', value: data.tripSummary.cancelled_trips, color: 'bg-red-500' },
    ];
  }, [data]);

  const dynamicETAChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'On Time', value: data.tripSummary.dispatched_trips || 5, color: 'bg-green-500' },
      { label: 'Delayed', value: data.tripSummary.cancelled_trips || 1, color: 'bg-orange-500' }
    ];
  }, [data]);

  const dynamicRouteChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Active', value: data.tripSummary.dispatched_trips, color: 'bg-blue-500' }
    ];
  }, [data]);

  return (
    <>
      <MetricsGrid metrics={dynamicMetrics} />

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
          <ChartCard title="ETA Delay Performance" icon={Clock} data={dynamicETAChart} />
          <ChartCard title="Delayed Route Segments" icon={Route} data={dynamicRouteChart} />
          <TimelineCard title="Dispatch Activity Log" events={dispatcherTimeline} />
        </div>

        <div className="space-y-8">
          <QuickActionsCard title="Dispatch Quick Actions" actions={dispatcherQuickActions} />
          <ChartCard title="Live Dispatch Status" icon={Route} data={dynamicLiveQueueChart} />
          <ChartCard title="Trip Completion Rates" icon={BarChart3} data={dynamicTripCompletionChart} />
        </div>
      </div>
    </>
  );
}


/* ═════════════════════════════════════════════════════
 * Financial Analyst layout
 * ═════════════════════════════════════════════════════ */


function FinancialAnalystDashboard({ data }: { data: DashboardData | null }) {
  const dynamicMetrics = useMemo(() => {
    if (!data) return financeMetrics;
    const { fuelSummary, expenseSummary, tripSummary } = data;
    return financeMetrics.map(m => {
      if (m.label === 'Total Expenses Today') return { ...m, value: `₹${expenseSummary.total_expense_amount.toLocaleString()}` };
      if (m.label === 'Fuel Spend') return { ...m, value: `₹${fuelSummary.total_fuel_cost.toLocaleString()}` };
      if (m.label === 'Revenue (Est.)') return { ...m, value: `₹${(tripSummary.completed_trips * 12000).toLocaleString()}` };
      return m;
    });
  }, [data]);

  const dynamicROIChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Est. Revenue', value: data.tripSummary.completed_trips * 12000, color: 'bg-green-500' },
      { label: 'Fuel Cost', value: data.fuelSummary.total_fuel_cost, color: 'bg-red-500' },
      { label: 'Other Expenses', value: data.expenseSummary.total_expense_amount, color: 'bg-orange-500' }
    ];
  }, [data]);

  const dynamicExpenseBreakdown = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Fuel', value: data.fuelSummary.total_fuel_cost, color: 'bg-blue-500' },
      { label: 'Maintenance', value: data.expenseSummary.total_expense_amount, color: 'bg-orange-500' },
    ];
  }, [data]);

  const dynamicFuelSpendChart = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Liters', value: data.fuelSummary.total_fuel_liters, color: 'bg-teal-500' },
      { label: 'Cost', value: data.fuelSummary.total_fuel_cost, color: 'bg-indigo-500' }
    ];
  }, [data]);

  const dynamicMonthlyCostTrend = useMemo(() => {
    if (!data) return [];
    return [
      { label: 'Current Total', value: data.fuelSummary.total_fuel_cost + data.expenseSummary.total_expense_amount, color: 'bg-red-500' }
    ];
  }, [data]);

  return (
    <>
      <MetricsGrid metrics={dynamicMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AlertCard title="Budget Alerts" alerts={financeAlerts} />
          <TableCard
            title="Expense Categories vs Budget"
            icon={BarChart3}
            columns={financeExpenseColumns}
            rows={financeExpenseRows}
          />
          <ChartCard title="Capital Asset ROI Index" icon={BarChart3} data={dynamicROIChart} />
          <ChartCard title="Monthly Expense Breakdown" icon={BarChart3} data={dynamicExpenseBreakdown} />
        </div>

        <div className="space-y-8">
          <QuickActionsCard title="Finance Quick Actions" actions={financeQuickActions} />
          <ChartCard title="Quarterly Fuel Spend" icon={Fuel} data={dynamicFuelSpendChart} />
          <ChartCard title="Monthly Operational Costs" icon={BarChart3} data={dynamicMonthlyCostTrend} />
        </div>
      </div>
    </>
  );
}


/* ═════════════════════════════════════════════════════
 * Main DashboardPage — role router
 * ═════════════════════════════════════════════════════ */

const DASHBOARD_MAP: Record<Role, React.FC<{ data: DashboardData | null }>> = {
  'Admin': AdminDashboard,
  'Fleet Manager': FleetManagerDashboard,
  'Dispatcher': DispatcherDashboard,
  'Financial Analyst': FinancialAnalystDashboard,
  'Safety Officer': AdminDashboard, // fallback to Admin view
};

export default function DashboardPage() {
  const { userRole } = useAuth();
  const role: Role = userRole ?? 'Admin';
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await getDashboardData();
      setData(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const defaultHeader = { title: 'Operations Command Center', subtitle: 'Enterprise-wide fleet operations overview', statusLabel: 'All Systems Operational', statusSeverity: 'normal' as const };
  const header = dashboardHeaders[role] ?? defaultHeader;
  const DashboardContent = DASHBOARD_MAP[role] ?? AdminDashboard;

  const handleExportPDF = () => {
    let currentMetrics = adminMetrics;
    
    if (data) {
      const { fleetSummary, tripSummary, driverSummary, fuelSummary, maintenanceSummary, expenseSummary } = data;
      if (role === 'Admin' || role === 'Safety Officer') {
        currentMetrics = adminMetrics.map(m => {
          if (m.label === 'Fleet Availability') return { ...m, value: `${Math.round((fleetSummary.available_vehicles / (fleetSummary.total_vehicles || 1)) * 100)}%`, subtitle: `${fleetSummary.available_vehicles} / ${fleetSummary.total_vehicles} vehicles available` };
          if (m.label === 'Active Trips') return { ...m, value: String(tripSummary.dispatched_trips), subtitle: `${tripSummary.dispatched_trips} active dispatches today` };
          if (m.label === 'Drivers On Duty') return { ...m, value: String(driverSummary.on_trip_drivers + driverSummary.available_drivers), subtitle: `${driverSummary.on_trip_drivers + driverSummary.available_drivers} of ${driverSummary.total_drivers} drivers deployed` };
          if (m.label === 'Vehicles In Shop') return { ...m, value: String(fleetSummary.in_shop_vehicles), subtitle: `${fleetSummary.in_shop_vehicles} under maintenance` };
          if (m.label === 'Fuel Spend Today') return { ...m, value: `₹${fuelSummary.total_fuel_cost.toLocaleString()}`, subtitle: `Across ${fuelSummary.total_fuel_records} refuel logs` };
          return m;
        });
      } else if (role === 'Fleet Manager') {
        currentMetrics = fleetMetrics.map(m => {
          if (m.label === 'Active Vehicles') return { ...m, value: String(fleetSummary.available_vehicles + fleetSummary.on_trip_vehicles), subtitle: `${fleetSummary.available_vehicles} idle, ${fleetSummary.on_trip_vehicles} en route` };
          if (m.label === 'Fleet Utilization') return { ...m, value: `${Math.round(((fleetSummary.on_trip_vehicles) / (fleetSummary.total_vehicles || 1)) * 100)}%`, subtitle: 'Target: >75%' };
          if (m.label === 'Pending Maintenance') return { ...m, value: String(maintenanceSummary.open_maintenance), subtitle: `${maintenanceSummary.open_maintenance} vehicles in shop` };
          return m;
        });
      } else if (role === 'Dispatcher') {
        currentMetrics = dispatcherMetrics.map(m => {
          if (m.label === 'Active Dispatches') return { ...m, value: String(tripSummary.dispatched_trips) };
          if (m.label === 'Drivers On Duty') return { ...m, value: String(driverSummary.on_trip_drivers) };
          if (m.label === 'Trips Completed') return { ...m, value: String(tripSummary.completed_trips) };
          return m;
        });
      } else if (role === 'Financial Analyst') {
        currentMetrics = financeMetrics.map(m => {
          if (m.label === 'Total Expenses Today') return { ...m, value: `₹${expenseSummary.total_expense_amount.toLocaleString()}` };
          if (m.label === 'Fuel Spend') return { ...m, value: `₹${fuelSummary.total_fuel_cost.toLocaleString()}` };
          if (m.label === 'Revenue (Est.)') return { ...m, value: `₹${(tripSummary.completed_trips * 12000).toLocaleString()}` };
          return m;
        });
      }
    } else {
      const activeMetricsMap: Record<Role, any[]> = {
        'Admin': adminMetrics,
        'Fleet Manager': fleetMetrics,
        'Dispatcher': dispatcherMetrics,
        'Financial Analyst': financeMetrics,
        'Safety Officer': adminMetrics,
      };
      currentMetrics = activeMetricsMap[role] || adminMetrics;
    }

    const kpis = currentMetrics.map((m) => ({ label: m.label, value: m.value }));
    const headers = ['Metric Label Indicator', 'Current Value Metrics', 'Details Status'];
    const rows = currentMetrics.map((m) => [m.label, m.value, m.subtitle]);

    exportToPdf({
      title: `${header.title} Summary`,
      role,
      kpis,
      headers,
      rows,
    });
  };

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
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="
              flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-buttons
              text-slate-700 bg-white hover:bg-slate-55 dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800
              border border-slate-205 dark:border-slate-800 transition-saas btn-press
            "
          >
            <Download size={14} />
            <span>Export Summary</span>
          </button>
          <StatusBadge label={header.statusLabel} severity={header.statusSeverity} />
        </div>
      </div>

      {/* Role‑specific content */}
      {isLoading ? (
        <Loader fullPage message="Loading dashboard data..." />
      ) : error ? (
        <ErrorState fullPage message={error} onRetry={fetchData} />
      ) : (
        <DashboardContent data={data} />
      )}
    </div>
  );
}
