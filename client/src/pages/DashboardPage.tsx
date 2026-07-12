/**
 * Dashboard Page — placeholder for Sprint 6 implementation.
 * Will include: KPI cards, recent trips table, vehicle status chart.
 * API: GET /api/dashboard
 */

import { Link } from 'react-router-dom';
import {
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  AlertTriangle,
  ArrowRight,
  Clock,
  Plus,
  AlertCircle
} from 'lucide-react';

const TOP_KPIS = [
  { label: 'Fleet Availability', value: '88%', sub: '42 / 48 Available', icon: Truck, color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/40 border border-green-100 dark:border-green-900/30' },
  { label: 'Active Trips', value: '12', sub: '12 active dispatches', icon: Route, color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30' },
  { label: 'Drivers On Duty', value: '38', sub: '38 on duty', icon: Users, color: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30' },
  { label: 'Vehicles In Shop', value: '4', sub: '4 in maintenance', icon: Wrench, color: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/30' },
  { label: 'Fuel Spend Today', value: '₹24,500', sub: 'Calculated from logs', icon: Fuel, color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30' },
  { label: 'Priority Alerts', value: '3', sub: 'Action required', icon: AlertTriangle, color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40 border border-red-100 dark:border-red-900/30' },
];

const PRIORITY_ALERTS = [
  { id: 1, type: 'critical', msg: 'Vehicle MH-12-AB-1234 reported high engine temperature warning', time: '12 mins ago' },
  { id: 2, type: 'warning', msg: 'Driver John Doe - License Category D renewal due in 4 days', time: '1 hour ago' },
  { id: 3, type: 'info', msg: 'Scheduled service overdue for MH-14-XY-8899 (truck)', time: '2 hours ago' },
];

const RECENT_TRIPS = [
  { id: 'TRP-3882', vehicle: 'MH-12-AB-1234', route: 'Pune → Mumbai', load: '14.2 Tons', status: 'Dispatched' },
  { id: 'TRP-3881', vehicle: 'MH-14-XY-8899', route: 'Mumbai → Nagpur', load: '18.0 Tons', status: 'Completed' },
  { id: 'TRP-3880', vehicle: 'MH-11-AA-4433', route: 'Chennai → Bengaluru', load: '8.5 Tons', status: 'In Progress' },
];

const UPCOMING_MAINTENANCE = [
  { id: 'MNT-092', vehicle: 'MH-12-AB-1234', task: '100,000 km General Overhaul', date: 'July 15, 2026' },
  { id: 'MNT-093', vehicle: 'MH-15-ZZ-9911', task: 'Tire replacement & balancing', date: 'July 17, 2026' },
];

const RECENT_ACTIVITIES = [
  { time: '10:42 AM', user: 'Admin User', event: 'Dispatched trip TRP-3882' },
  { time: '09:15 AM', user: 'Dispatcher User', event: 'Completed trip TRP-3881' },
  { time: 'Yesterday', user: 'Fleet Manager', event: 'Checked MH-11-AA-4433 into Maintenance Shop' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Operations Command Center</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Real-time supervision control console for logistics management</p>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOP_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-saas group"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 leading-none">{kpi.value}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 pt-1 font-medium">{kpi.sub}</p>
              </div>
              <div className={`p-3 rounded-xl transition-saas group-hover:scale-105 ${kpi.color}`}>
                <kpi.icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Operational Alerts & Active Status */}
        <div className="lg:col-span-2 space-y-8">
          {/* Priority Alerts */}
          <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-500" />
                Priority Alerts
              </h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">Action Required</span>
            </div>
            <div className="space-y-3">
              {PRIORITY_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                    alert.type === 'critical'
                      ? 'bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/20 text-red-800 dark:text-red-300'
                      : 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/20 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium">{alert.msg}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{alert.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trips Dispatch */}
          <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                <Route size={18} className="text-primary-500" />
                Recent Trips & Dispatch Log
              </h2>
              <Link to="/trips" className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase text-slate-400 pb-2">
                    <th className="py-2.5">Trip ID</th>
                    <th>Vehicle</th>
                    <th>Route</th>
                    <th>Load</th>
                    <th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {RECENT_TRIPS.map((trip) => (
                    <tr key={trip.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-saas">
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">{trip.id}</td>
                      <td className="text-slate-600 dark:text-slate-400">{trip.vehicle}</td>
                      <td className="text-slate-600 dark:text-slate-400">{trip.route}</td>
                      <td className="text-slate-600 dark:text-slate-400">{trip.load}</td>
                      <td className="text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          trip.status === 'Completed'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Columns - Quick Actions, Schedule & Charts */}
        <div className="space-y-8">
          {/* Quick Actions Control Room */}
          <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Dispatch Controls</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/trips"
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 hover:border-primary-100 dark:hover:border-primary-900 transition-saas text-center btn-press group"
              >
                <Plus size={18} className="text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">New Trip</span>
              </Link>
              <Link
                to="/maintenance"
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 hover:border-primary-100 dark:hover:border-primary-900 transition-saas text-center btn-press group"
              >
                <Wrench size={18} className="text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-900 dark:text-white">Schedule Shop</span>
              </Link>
            </div>
          </div>

          {/* Upcoming Maintenance */}
          <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock size={18} className="text-primary-500" />
              Scheduled Maintenance
            </h2>
            <div className="space-y-4">
              {UPCOMING_MAINTENANCE.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-slate-500">
                    <Wrench size={14} />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.vehicle}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.task}</p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Log activity timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Command Logs</h2>
            <div className="relative border-l border-slate-100 dark:border-slate-800 pl-4 space-y-5 py-1">
              {RECENT_ACTIVITIES.map((act, idx) => (
                <div key={idx} className="relative text-xs">
                  {/* Point */}
                  <span className="absolute -left-[20.5px] top-1.5 h-2 w-2 rounded-full bg-primary-500 ring-4 ring-white dark:ring-slate-900" />
                  <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                    <span>{act.user}</span>
                    <span>{act.time}</span>
                  </div>
                  <p className="font-medium text-slate-700 dark:text-slate-300 mt-1">{act.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
