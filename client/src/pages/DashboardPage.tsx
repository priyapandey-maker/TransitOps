/**
 * Dashboard Page — placeholder for Sprint 6 implementation.
 * Will include: KPI cards, recent trips table, vehicle status chart.
 * API: GET /api/dashboard
 */

import { BarChart3, Truck, Users, Route, Wrench, TrendingUp } from 'lucide-react';

const PLACEHOLDER_KPIS = [
  { label: 'Active Vehicles', value: '42', trend: '+4% from last week', icon: Truck, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30' },
  { label: 'Available Vehicles', value: '28', trend: 'Stable fleet size', icon: Truck, color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/40 border border-green-100 dark:border-green-900/30' },
  { label: 'Vehicles in Shop', value: '4', trend: '-2 since yesterday', icon: Wrench, color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/30' },
  { label: 'Active Trips', value: '12', trend: '8 scheduled for PM', icon: Route, color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30' },
  { label: 'Drivers On Duty', value: '38', trend: '98% compliance rate', icon: Users, color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30' },
  { label: 'Fleet Utilization', value: '88%', trend: '+1.2% efficiency lift', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/30' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col gap-1 text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Control Center</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Real-time operational supervision and fleet intelligence overview</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLACEHOLDER_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-saas group"
          >
            <div className="flex items-start justify-between">
              <div className="text-left space-y-1">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 leading-none">{kpi.value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 pt-1 font-medium">{kpi.trend}</p>
              </div>
              <div className={`p-3 rounded-xl transition-saas group-hover:scale-105 ${kpi.color}`}>
                <kpi.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Widgets row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Trips */}
        <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
            <Route size={18} className="text-primary-500" />
            Recent Trips Dispatch
          </h2>
          <div className="text-xs text-slate-400 dark:text-slate-500 text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
            No active trips currently dispatched.
          </div>
        </div>

        {/* Vehicle Status Distribution */}
        <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
            <BarChart3 size={18} className="text-primary-500" />
            Fleet Allocation Status
          </h2>
          <div className="text-xs text-slate-400 dark:text-slate-500 text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50">
            All logistics assets successfully registered.
          </div>
        </div>
      </div>
    </div>
  );
}
