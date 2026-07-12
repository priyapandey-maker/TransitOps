import { useState } from 'react';
import {
  Building,
  Settings,
  Shield,
  Lock,
  Database,
  Sun,
  Moon,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

type ActiveSection = 'company' | 'preferences' | 'rbac' | 'security' | 'export';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { userRole } = useAuth();
  
  const [activeSection, setActiveSection] = useState<ActiveSection>('company');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const triggerAlert = (message: string) => {
    setAlertMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  // Company Profile states
  const [companyName, setCompanyName] = useState('TransitOps Logistics India');
  const [gstin, setGstin] = useState('27AAAAA1111A1Z1');
  const [contactEmail, setContactEmail] = useState('ops@transitops.com');
  const [fleetHub, setFleetHub] = useState('Mumbai Main Depot');

  // Security password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notifications states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsDispatches, setSmsDispatches] = useState(true);
  const [criticalTempAlerts, setCriticalTempAlerts] = useState(true);

  // RBAC Permission Grid mappings
  const rbacRules = [
    { module: 'Fleet Registry', admin: 'Full', fleetManager: 'Full', dispatcher: 'Read', safety: 'Read', finance: 'Read' },
    { module: 'Driver Roster', admin: 'Full', fleetManager: 'Read', dispatcher: 'Full', safety: 'Full', finance: 'Read' },
    { module: 'Dispatches / Trips', admin: 'Full', fleetManager: 'Full', dispatcher: 'Full', safety: 'Read', finance: 'Read' },
    { module: 'Maintenance Operations', admin: 'Full', fleetManager: 'Full', dispatcher: 'Read', safety: 'Read', finance: 'Read' },
    { module: 'Fuel & Cost Journals', admin: 'Full', fleetManager: 'Full', dispatcher: 'Read', safety: 'Read', finance: 'Full' },
    { module: 'Business Intelligence', admin: 'Full', fleetManager: 'Full', dispatcher: 'Read', safety: 'Read', finance: 'Full' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-left">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
          Manage system administration permissions, corporate company profile details, and data journals.
        </p>
      </div>

      {/* Global alert banner */}
      {showSuccessAlert && (
        <div className="flex items-center gap-3 p-4 text-xs font-semibold rounded-lg bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 border border-green-200/50 dark:border-green-900/30">
          <CheckCircle2 size={16} />
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Grid container with left navigation and right panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Navigation Grouped Cards */}
        <div className="lg:col-span-1 space-y-2.5">
          <button
            onClick={() => setActiveSection('company')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg border transition-saas text-left btn-press
              ${activeSection === 'company'
                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-primary-150/40 dark:border-primary-900/30'
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200/60 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            <Building size={16} />
            <span>Company Profile</span>
          </button>

          <button
            onClick={() => setActiveSection('preferences')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg border transition-saas text-left btn-press
              ${activeSection === 'preferences'
                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-primary-150/40 dark:border-primary-900/30'
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200/60 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            <Settings size={16} />
            <span>Preferences & Theme</span>
          </button>

          <button
            onClick={() => setActiveSection('rbac')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg border transition-saas text-left btn-press
              ${activeSection === 'rbac'
                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-primary-150/40 dark:border-primary-900/30'
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200/60 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            <Shield size={16} />
            <span>Role Permissions (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg border transition-saas text-left btn-press
              ${activeSection === 'security'
                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-primary-150/40 dark:border-primary-900/30'
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200/60 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            <Lock size={16} />
            <span>Security & Passwords</span>
          </button>

          <button
            onClick={() => setActiveSection('export')}
            className={`
              w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg border transition-saas text-left btn-press
              ${activeSection === 'export'
                ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-primary-150/40 dark:border-primary-900/30'
                : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200/60 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
          >
            <Database size={16} />
            <span>Data Export Utilities</span>
          </button>
        </div>

        {/* Right Content Panel Cards */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6.5 rounded-cards shadow-sm">
            
            {/* SECTION 1: Company Profile */}
            {activeSection === 'company' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerAlert('Company profile updated successfully.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building size={18} className="text-primary-500" />
                    Corporate Profile Details
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Verify primary registration records of the fleet operations entity.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Registered Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Tax Identification / GSTIN</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Operations Contact Email</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Primary Fleet Operations Hub</label>
                    <input
                      type="text"
                      value={fleetHub}
                      onChange={(e) => setFleetHub(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-5 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" className="flex items-center gap-2 px-4.5 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons shadow-sm transition-saas btn-press">
                    <Save size={14} />
                    Save Company Profile
                  </button>
                </div>
              </form>
            )}

            {/* SECTION 2: User Preferences & Theme */}
            {activeSection === 'preferences' && (
              <form onSubmit={(e) => { e.preventDefault(); triggerAlert('Preferences and notifications updated successfully.'); }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings size={18} className="text-primary-500" />
                    Preferences & System Theme
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Coordinate display preferences, localized triggers, and system theme settings.</p>
                </div>

                {/* Theme Selector */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">System Theme Mode</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`
                        flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-xs font-semibold transition-saas btn-press
                        ${theme === 'light'
                          ? 'bg-slate-55 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white border-slate-300 dark:border-slate-800 shadow-sm'
                          : 'text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                        }
                      `}
                    >
                      <Sun size={15} />
                      Light Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`
                        flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-xs font-semibold transition-saas btn-press
                        ${theme === 'dark'
                          ? 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white border-slate-350 dark:border-slate-800 shadow-sm'
                          : 'text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                        }
                      `}
                    >
                      <Moon size={15} />
                      Dark Mode
                    </button>
                  </div>
                </div>

                {/* Notifications Toggles */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Bell size={12} />
                    Notification Toggles
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 select-none text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="rounded border-slate-300 text-primary-500 focus:ring-primary-500/20 mt-0.5 h-4 w-4"
                      />
                      <div>
                        <span>Email compliance summaries</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Daily summary of license expirations and maintenance logs.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 select-none text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsDispatches}
                        onChange={(e) => setSmsDispatches(e.target.checked)}
                        className="rounded border-slate-300 text-primary-500 focus:ring-primary-500/20 mt-0.5 h-4 w-4"
                      />
                      <div>
                        <span>Automatic SMS dispatch logs</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Send real-time dispatch metadata warnings directly to duty operators.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 select-none text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={criticalTempAlerts}
                        onChange={(e) => setCriticalTempAlerts(e.target.checked)}
                        className="rounded border-slate-300 text-primary-500 focus:ring-primary-500/20 mt-0.5 h-4 w-4"
                      />
                      <div>
                        <span>Critical diagnostic telemetry</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Push alarm notifications if a diagnostic error triggers (e.g. overtemp).</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-5 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" className="flex items-center gap-2 px-4.5 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons shadow-sm transition-saas btn-press">
                    <Save size={14} />
                    Save Preferences
                  </button>
                </div>
              </form>
            )}

            {/* SECTION 3: Role Permissions Matrix */}
            {activeSection === 'rbac' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Shield size={18} className="text-primary-500" />
                    Role Permission Matrix (RBAC)
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">System matrices dictating access rules based on current user role session: <strong className="text-slate-800 dark:text-slate-200">{userRole}</strong>.</p>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-4 py-3">ERP MODULE</th>
                        <th className="px-4 py-3">ADMIN</th>
                        <th className="px-4 py-3">FLEET MGR</th>
                        <th className="px-4 py-3">DISPATCH</th>
                        <th className="px-4 py-3">SAFETY</th>
                        <th className="px-4 py-3">FINANCE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-semibold text-slate-700 dark:text-slate-350">
                      {rbacRules.map((rule) => (
                        <tr key={rule.module} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                          <td className="px-4 py-3 font-bold text-slate-850 dark:text-slate-200">{rule.module}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100">
                              {rule.admin}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded border ${rule.fleetManager === 'Full' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800'}`}>
                              {rule.fleetManager}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded border ${rule.dispatcher === 'Full' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800'}`}>
                              {rule.dispatcher}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded border ${rule.safety === 'Full' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800'}`}>
                              {rule.safety}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded border ${rule.finance === 'Full' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20' : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800'}`}>
                              {rule.finance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECTION 4: Security & Passwords */}
            {activeSection === 'security' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (newPassword !== confirmPassword) {
                  triggerAlert('New passwords do not match.');
                  return;
                }
                triggerAlert('System administrator security credentials updated.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Lock size={18} className="text-primary-500" />
                    Security & Passwords
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Maintain security access rules, modify current password keys, and check administrative credentials.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-5 border-t border-slate-100 dark:border-slate-800">
                  <button type="submit" className="flex items-center gap-2 px-4.5 py-2 text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-buttons shadow-sm transition-saas btn-press">
                    <Save size={14} />
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {/* SECTION 5: Data Export Utilities */}
            {activeSection === 'export' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Database size={18} className="text-primary-500" />
                    Data Export Utilities
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">Backup registers, export expense sheets, or generate system configurations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl space-y-4 bg-slate-50/50 dark:bg-slate-950/20 text-center">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                      <Database size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Fleet Registry</h4>
                      <p className="text-[10px] text-slate-405 dark:text-slate-500 mt-1 font-medium">Download complete vehicle and RC registration tables in CSV format.</p>
                    </div>
                    <button
                      onClick={() => triggerAlert('Fleet registry backup sheet download initiated.')}
                      className="w-full px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-saas btn-press"
                    >
                      Export CSV
                    </button>
                  </div>

                  <div className="border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl space-y-4 bg-slate-50/50 dark:bg-slate-950/20 text-center">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Cost & Expenses</h4>
                      <p className="text-[10px] text-slate-405 dark:text-slate-500 mt-1 font-medium">Download complete expenses and fuel logs journals in CSV format.</p>
                    </div>
                    <button
                      onClick={() => triggerAlert('Expenses sheet audit logs download initiated.')}
                      className="w-full px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-saas btn-press"
                    >
                      Export CSV
                    </button>
                  </div>

                  <div className="border border-slate-200/80 dark:border-slate-800 p-5 rounded-xl space-y-4 bg-slate-50/50 dark:bg-slate-950/20 text-center">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
                      <Shield size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">System Audit Trail</h4>
                      <p className="text-[10px] text-slate-405 dark:text-slate-500 mt-1 font-medium">Download complete dispatcher and compliance logs in JSON schema format.</p>
                    </div>
                    <button
                      onClick={() => triggerAlert('System compliance JSON audit backup download initiated.')}
                      className="w-full px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-saas btn-press"
                    >
                      Export JSON
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800/80 mt-5">
                  <AlertCircle size={16} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 leading-normal font-semibold">
                    Backup exports contain confidential fleet operations, licensing, and financial telemetry data. Avoid downloading to unauthorized machines or sharing registers outside protected networks.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
