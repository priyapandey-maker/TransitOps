/**
 * Settings Page — placeholder for Sprint 7 (if time permits).
 * Will include: General settings, RBAC matrix, user profile.
 * No advanced configuration per contract.
 */

import { Shield, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">System configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <User size={18} />
            General Settings
          </h2>
          <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
            Settings will be available in a later sprint.
          </div>
        </div>

        {/* RBAC Matrix */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Shield size={18} />
            Role Permissions
          </h2>
          <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">
            RBAC matrix will be available in a later sprint.
          </div>
        </div>
      </div>
    </div>
  );
}
