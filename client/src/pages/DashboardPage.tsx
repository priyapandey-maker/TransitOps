/**
 * Dashboard Page — placeholder for Sprint 6 implementation.
 * Will include: KPI cards, recent trips table, vehicle status chart.
 * API: GET /api/dashboard
 */

import { BarChart3, Truck, Users, Route, Wrench, TrendingUp } from 'lucide-react';

const PLACEHOLDER_KPIS = [
  { label: 'Active Vehicles', value: '—', icon: Truck, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' },
  { label: 'Available Vehicles', value: '—', icon: Truck, color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30' },
  { label: 'Vehicles in Shop', value: '—', icon: Wrench, color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30' },
  { label: 'Active Trips', value: '—', icon: Route, color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/30' },
  { label: 'Drivers On Duty', value: '—', icon: Users, color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30' },
  { label: 'Fleet Utilization', value: '—', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fleet operations overview</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLACEHOLDER_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{kpi.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Route size={18} />
            Recent Trips
          </h2>
          <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
            No trip data available yet.
          </div>
        </div>

        {/* Vehicle Status Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 size={18} />
            Vehicle Status
          </h2>
          <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
            No vehicle data available yet.
          </div>
        </div>
      </div>
    </div>
  );
}
