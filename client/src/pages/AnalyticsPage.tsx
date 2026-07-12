/**
 * Analytics Page — placeholder for Sprint 6.
 * Will include: KPI cards, activity charts, top cost vehicles, fleet utilization.
 * API: GET /api/analytics
 */

import { BarChart3, TrendingUp, DollarSign, Fuel } from 'lucide-react';

const ANALYTICS_KPIS = [
  { label: 'Fleet Utilization', value: '—', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' },
  { label: 'Operational Cost', value: '—', icon: DollarSign, color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30' },
  { label: 'Fuel Efficiency', value: '—', icon: Fuel, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' },
  { label: 'Vehicle ROI', value: '—', icon: BarChart3, color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fleet performance and cost analysis</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ANALYTICS_KPIS.map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
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

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Activity Trend</h2>
          <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-12">
            Chart will render here once data is available.
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Top Cost Vehicles</h2>
          <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-12">
            Chart will render here once data is available.
          </div>
        </div>
      </div>
    </div>
  );
}
