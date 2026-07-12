import { useEffect, useState, useMemo } from 'react';
import {
  Building,
  Settings,
  Shield,
  Lock,
  Database,
  Users,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle,
  Truck,
  Wrench,
  Route,
  Clock,
  DollarSign,
  Download
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { exportToPdf } from '../utils/pdfExport';

// Define setting tabs per role
interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number }>;
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { userRole } = useAuth();
  const role = userRole ?? 'Admin';

  const [activeTab, setActiveTab] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const triggerSave = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Configure tabs based on active user role
  const tabs = useMemo((): TabConfig[] => {
    switch (role) {
      case 'Admin':
        return [
          { id: 'company', label: 'Company Profile', icon: Building },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'rbac', label: 'RBAC Access Grid', icon: Shield },
          { id: 'security', label: 'Security & Passwords', icon: Lock },
          { id: 'audit', label: 'System Audit Logs', icon: FileText },
          { id: 'sysPref', label: 'System Preferences', icon: Settings },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'export', label: 'Data Export Utilities', icon: Database },
        ];
      case 'Fleet Manager':
        return [
          { id: 'fleetConfig', label: 'Fleet Configuration', icon: Truck },
          { id: 'maintenancePref', label: 'Maintenance Preferences', icon: Wrench },
          { id: 'serviceAlerts', label: 'Service Alerts', icon: AlertCircle },
          { id: 'vehicleCategories', label: 'Vehicle Categories', icon: Settings },
          { id: 'inspectionSettings', label: 'Inspection Settings', icon: FileText },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ];
      case 'Dispatcher':
        return [
          { id: 'dispatchRules', label: 'Dispatch Rules', icon: Route },
          { id: 'routePref', label: 'Route Preferences', icon: Settings },
          { id: 'driverAvailability', label: 'Driver Availability', icon: Users },
          { id: 'shiftSettings', label: 'Shift Settings', icon: Clock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ];
      case 'Financial Analyst':
        return [
          { id: 'financialPref', label: 'Financial Preferences', icon: DollarSign },
          { id: 'expenseCategories', label: 'Expense Categories', icon: Settings },
          { id: 'budgetThresholds', label: 'Budget Thresholds', icon: AlertCircle },
          { id: 'reportTemplates', label: 'Report Templates', icon: FileText },
          { id: 'exportSettings', label: 'Export Settings', icon: Database },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ];
      default:
        return [];
    }
  }, [role]);

  // Reset active tab to first option when tabs array changes
  useEffect(() => {
    if (tabs.length > 0 && tabs[0]) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs]);

  // Shared matrix permission layout
  const rbacRules = [
    { module: 'Fleet Registry', admin: 'Full', fleetManager: 'Full', dispatcher: 'Read', finance: 'Read' },
    { module: 'Driver Roster', admin: 'Full', fleetManager: 'Read', dispatcher: 'Full', finance: 'Read' },
    { module: 'Trips / Dispatches', admin: 'Full', fleetManager: 'Full', dispatcher: 'Full', finance: 'Read' },
    { module: 'Maintenance Logs', admin: 'Full', fleetManager: 'Full', dispatcher: 'Read', finance: 'Read' },
    { module: 'Fuel & Cost Sheets', admin: 'Full', fleetManager: 'Full', dispatcher: 'Read', finance: 'Full' },
  ];

  const handleExportPDF = () => {
    const kpis = [
      { label: 'Role Context', value: role },
      { label: 'System Theme', value: theme === 'dark' ? 'Dark Mode' : 'Light Mode' },
      { label: 'Registrations', value: '27AAAAA1111A1Z1' },
      { label: 'Modules Configured', value: rbacRules.length.toString() },
    ];
    const headers = ['System Module Reference', 'Admin Permission', 'Manager Permission', 'Dispatcher Role', 'Finance Role'];
    const rows = rbacRules.map((rule) => [
      rule.module,
      rule.admin,
      rule.fleetManager,
      rule.dispatcher,
      rule.finance,
    ]);

    exportToPdf({
      title: 'Configuration Summary Report',
      role,
      kpis,
      headers,
      rows,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Role-Aware Settings</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
            Personalized configuration console for authenticated role: <strong className="text-slate-805 dark:text-slate-200">{role}</strong>.
          </p>
        </div>
        {role === 'Admin' && (
          <button
            onClick={handleExportPDF}
            className="
              flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-buttons
              text-slate-700 bg-white hover:bg-slate-50 dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800
              border border-slate-205 dark:border-slate-800 transition-saas btn-press self-start sm:self-auto
            "
          >
            <Download size={14} />
            <span>Export Configuration</span>
          </button>
        )}
      </div>

      {/* Save Alert */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 text-xs font-semibold rounded-lg bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200/50 dark:border-green-900/30">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Tab Navigation */}
        <div className="lg:col-span-1 space-y-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg border transition-saas text-left btn-press
                  ${activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-primary-150/40 dark:border-primary-900/30'
                    : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200/60 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Side Panel cards */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-cards shadow-sm">
            
            {/* ── ADMIN TABS ─────────────────────────────────── */}
            {activeTab === 'company' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Company profile details saved.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Company Profile</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Configure company name, registration, and fleet hubs.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5 uppercase">Company Name</label>
                    <input type="text" defaultValue="TransitOps Logistics India" className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5 uppercase">GSTIN / Registration</label>
                    <input type="text" defaultValue="27AAAAA1111A1Z1" className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Changes</button>
              </form>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">User Management</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review active system user accounts.</p>
                </div>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400">
                      <tr>
                        <th className="px-4 py-3">NAME</th>
                        <th className="px-4 py-3">ROLE</th>
                        <th className="px-4 py-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-350 font-semibold">
                      <tr>
                        <td className="px-4 py-3 text-slate-900 dark:text-white">Priya Pandey</td>
                        <td className="px-4 py-3">Admin</td>
                        <td className="px-4 py-3 text-green-600">Active</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-slate-900 dark:text-white">Vikram Rathore</td>
                        <td className="px-4 py-3">Fleet Manager</td>
                        <td className="px-4 py-3 text-green-600">Active</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'rbac' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">RBAC Permissions</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review module security matrices.</p>
                </div>
                <div className="overflow-x-auto border border-slate-205 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-450">
                      <tr>
                        <th className="px-4 py-3">MODULE</th>
                        <th className="px-4 py-3">ADMIN</th>
                        <th className="px-4 py-3">FLEET MGR</th>
                        <th className="px-4 py-3">DISPATCH</th>
                        <th className="px-4 py-3">FINANCE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {rbacRules.map(rule => (
                        <tr key={rule.module}>
                          <td className="px-4 py-3 font-bold text-slate-850 dark:text-white">{rule.module}</td>
                          <td className="px-4 py-3 text-emerald-600">{rule.admin}</td>
                          <td className="px-4 py-3">{rule.fleetManager}</td>
                          <td className="px-4 py-3">{rule.dispatcher}</td>
                          <td className="px-4 py-3">{rule.finance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Password changed.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Security</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Update passwords and credentials.</p>
                </div>
                <div className="space-y-4 max-w-sm text-xs font-semibold">
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5">CURRENT PASSWORD</label>
                    <input type="password" placeholder="••••••••" className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5">NEW PASSWORD</label>
                    <input type="password" placeholder="••••••••" className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-205 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Update Password</button>
              </form>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">System Audit Logs</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Track operational administrative changes.</p>
                </div>
                <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-2">
                    <span>Admin modified system backup intervals</span>
                    <span className="text-[10px] text-slate-400">10:45 AM</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-2">
                    <span>Admin generated complete data export register</span>
                    <span className="text-[10px] text-slate-400">Yesterday</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sysPref' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('System preferences saved.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">System Preferences</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Change core intervals and configurations.</p>
                </div>
                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5 uppercase">Odometer Check Interval</label>
                    <select className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none">
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Preferences</button>
              </form>
            )}

            {/* ── FLEET MANAGER TABS ─────────────────────────── */}
            {activeTab === 'fleetConfig' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Fleet configuration updated.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Fleet Configuration</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Configure active fleet size boundaries.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5 uppercase">Max Fleet Size Limit</label>
                    <input type="number" defaultValue="50" className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-205 bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Fleet Limits</button>
              </form>
            )}

            {activeTab === 'maintenancePref' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Maintenance routing configured.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Maintenance Preferences</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Auto-assignment guidelines for workshops.</p>
                </div>
                <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-350 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-primary-500 focus:ring-primary-500/20 h-4 w-4" />
                  Auto-create service schedules based on odometer limits
                </label>
                <div className="pt-2">
                  <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Maintenance Rules</button>
                </div>
              </form>
            )}

            {activeTab === 'serviceAlerts' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Service threshold alerts saved.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Service Alerts</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Configure diagnostic thresholds.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5 uppercase">Critical Temperature Threshold (°C)</label>
                    <input type="number" defaultValue="105" className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Alerts</button>
              </form>
            )}

            {activeTab === 'vehicleCategories' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Vehicle Categories</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review active vehicle configurations.</p>
                </div>
                <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg">Trucks (Heavy Duty Cargo Dispatches)</div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg">Vans (Medium Light Utility distribution)</div>
                </div>
              </div>
            )}

            {activeTab === 'inspectionSettings' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Pre-trip inspection rules updated.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Inspection Settings</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Pre-trip checklist item guidelines.</p>
                </div>
                <div className="space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary-500 h-4 w-4" /> Ensure engine oil level verification
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary-500 h-4 w-4" /> Require tire safety indicators verification
                  </label>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Rules</button>
              </form>
            )}

            {/* ── DISPATCHER TABS ────────────────────────────── */}
            {activeTab === 'dispatchRules' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Dispatch allocation rules saved.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Dispatch Rules</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Assign routing queues automatically.</p>
                </div>
                <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded text-primary-500 h-4 w-4" />
                  Auto-assign closest available driver to dispatches
                </label>
                <div className="pt-2">
                  <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Dispatch Rules</button>
                </div>
              </form>
            )}

            {activeTab === 'routePref' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Route optimization preferences saved.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Route Preferences</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Routing optimization guidelines.</p>
                </div>
                <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded text-primary-500 h-4 w-4" />
                  Prioritize expressway routing (avoiding local routes)
                </label>
                <div className="pt-2">
                  <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Route preferences</button>
                </div>
              </form>
            )}

            {activeTab === 'driverAvailability' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Driver hours restrictions updated.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Driver Availability</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Driver schedule constraints.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5 uppercase">Max Drive Hours per Shift</label>
                    <input type="number" defaultValue="10" className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Rules</button>
              </form>
            )}

            {activeTab === 'shiftSettings' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Shift Settings</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review active shift configurations.</p>
                </div>
                <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg">Day Shift (08:00 - 18:00 dispatches)</div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg">Night Shift (18:00 - 08:00 dispatches)</div>
                </div>
              </div>
            )}

            {/* ── FINANCIAL ANALYST TABS ──────────────────────── */}
            {activeTab === 'financialPref' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Financial currency configurations saved.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Financial Preferences</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Configure default accounting currencies.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5 uppercase">Default Currency</label>
                    <select className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-205 bg-slate-50 dark:bg-slate-950 focus:outline-none">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Settings</button>
              </form>
            )}

            {activeTab === 'expenseCategories' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Expense Categories</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review active expense budget classes.</p>
                </div>
                <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg">Fuel Costs (Refuel journals)</div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg">Maintenance Costs (Workshop bills)</div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-lg">Toll Fees (Expressway clearances)</div>
                </div>
              </div>
            )}

            {activeTab === 'budgetThresholds' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Budget threshold alerts configured.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Budget Thresholds</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Budget utilization alarm limits.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5 uppercase">Trigger Warning at (%)</label>
                    <input type="number" defaultValue="90" className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 dark:bg-slate-950 focus:outline-none" />
                  </div>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Alert Limits</button>
              </form>
            )}

            {activeTab === 'reportTemplates' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Financial summary formats updated.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Report Templates</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Default export document format specifications.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-400 dark:text-slate-500 mb-1.5 uppercase">Default File Export Format</label>
                    <select className="w-full h-11 px-3 py-2 text-sm rounded-lg border border-slate-205 bg-slate-50 dark:bg-slate-950 focus:outline-none">
                      <option>PDF Document (.pdf)</option>
                      <option>Excel Worksheet (.xlsx)</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Format</button>
              </form>
            )}

            {activeTab === 'exportSettings' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Monthly auto-export rules configured.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Export Settings</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Centralized accounting server uploads.</p>
                </div>
                <label className="flex items-center gap-3 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded text-primary-500 h-4 w-4" />
                  Auto-upload expense logs directly to primary server
                </label>
                <div className="pt-2">
                  <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Rules</button>
                </div>
              </form>
            )}

            {/* ── EXPORT DATA (SHARED/ADMIN) ─────────────────── */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Data Export Utilities</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Download backup registers or audit trails.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-center space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Fleet Registry</h4>
                    <button type="button" onClick={() => triggerSave('Downloading fleet registry CSV...')} className="px-3.5 py-1.5 text-[10px] font-semibold border border-slate-205 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 transition-saas btn-press">Export CSV</button>
                  </div>
                  <div className="p-4 border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-center space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Cost Journals</h4>
                    <button type="button" onClick={() => triggerSave('Downloading cost journals CSV...')} className="px-3.5 py-1.5 text-[10px] font-semibold border border-slate-205 bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-50 transition-saas btn-press">Export CSV</button>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS TABS (SHARED) ────────────────── */}
            {activeTab === 'notifications' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerSave('Notification options updated.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Notifications Preferences</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Configure warning toggle rules.</p>
                </div>
                <div className="space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary-500 h-4 w-4" /> Send email digest of status variations
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary-500 h-4 w-4" /> Push dashboard warnings on critical triggers
                  </label>
                </div>
                <button type="submit" className="px-4.5 py-2.5 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons transition-saas btn-press">Save Preferences</button>
              </form>
            )}

            {/* ── SYSTEM THEME TOGGLE (SHARED PREFERENCES) ───── */}
            {role !== 'Admin' && activeTab === 'notifications' && (
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="border-b border-slate-50 dark:border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">System Theme Mode</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle interface preferences.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-saas btn-press
                      ${theme === 'light' ? 'bg-slate-100 text-slate-900 border-slate-300 font-bold' : 'text-slate-500 border-slate-200'}
                    `}
                  >
                    Light Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-saas btn-press
                      ${theme === 'dark' ? 'bg-slate-950 text-white border-slate-800 font-bold' : 'text-slate-500 border-slate-200'}
                    `}
                  >
                    Dark Mode
                  </button>
                </div>
              </div>
            )}

            {role === 'Admin' && activeTab === 'sysPref' && (
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="border-b border-slate-50 dark:border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">System Theme Mode</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle interface preferences.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-saas btn-press
                      ${theme === 'light' ? 'bg-slate-100 text-slate-900 border-slate-300 font-bold' : 'text-slate-500 border-slate-200'}
                    `}
                  >
                    Light Mode
                  </button>
                  <button
                    type="button"
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`
                      flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-saas btn-press
                      ${theme === 'dark' ? 'bg-slate-950 text-white border-slate-800 font-bold' : 'text-slate-500 border-slate-200'}
                    `}
                  >
                    Dark Mode
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
