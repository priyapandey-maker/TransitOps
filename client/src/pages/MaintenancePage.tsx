/**
 * Maintenance Page — placeholder for Sprint 4.
 * Will include: Maintenance records, service history, close workflow.
 * API: GET/POST/PUT /api/maintenance, POST /api/maintenance/:id/close
 */

import { Plus, Search, Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track vehicle service and repairs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
          <Plus size={16} />
          Raise Maintenance
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search maintenance records..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
        </div>
        <select className="px-3 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-8 text-center">
          <Wrench size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Maintenance records will appear here once the API is integrated.</p>
        </div>
      </div>
    </div>
  );
}
