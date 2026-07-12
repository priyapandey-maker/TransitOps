/**
 * Fuel & Expenses Page — placeholder for Sprint 5.
 * Combines fuel logs and expense tracking in a tabbed view.
 * API: GET/POST/PUT /api/fuel, GET/POST/PUT /api/expenses
 */

import { useState } from 'react';
import { Plus, Search, Fuel, DollarSign } from 'lucide-react';

type ActiveTab = 'fuel' | 'expenses';

export default function FuelExpensesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('fuel');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fuel & Expenses</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track operational costs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700">
          <Plus size={16} />
          {activeTab === 'fuel' ? 'Add Fuel Log' : 'Add Expense'}
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('fuel')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'fuel'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <Fuel size={16} />
          Fuel Logs
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'expenses'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
          }`}
        >
          <DollarSign size={16} />
          Expenses
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'fuel' ? 'fuel logs' : 'expenses'}...`}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Table placeholder */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="p-8 text-center">
          {activeTab === 'fuel' ? (
            <Fuel size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          ) : (
            <DollarSign size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          )}
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {activeTab === 'fuel' ? 'Fuel log' : 'Expense'} data will appear here once the API is integrated.
          </p>
        </div>
      </div>
    </div>
  );
}
