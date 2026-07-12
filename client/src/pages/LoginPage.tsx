import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { login as loginService } from '../services/auth.api';
import { loginSchema } from '../types/auth.types';
import type { LoginCredentials } from '../types/auth.types';
import { LogIn, Moon, Sun, Eye, EyeOff, Loader2, Truck, Route, Wrench, Users } from 'lucide-react';
import { APP_NAME } from '../constants/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Fleet Manager' | 'Dispatcher' | 'Financial Analyst'>('Admin');
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setApiError(null);
    setLoading(true);

    try {
      const response = await loginService(data);
      if (response.success && response.data) {
        const { token, user } = response.data;
        // Apply selected role to logged in user profile details
        const overriddenUser = {
          ...user,
          role: selectedRole,
          fullName: `${selectedRole} Officer`,
        };
        login(token, overriddenUser);
        navigate('/dashboard');
      } else {
        setApiError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: unknown) {
      // Safely parse handled error structure
      const parsedError = err as { message?: string };
      setApiError(parsedError.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-buttons text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 border border-slate-200/40 dark:border-slate-800 transition-saas btn-press z-10"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </button>

      {/* Left panel: Enterprise Logistics control room details */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white p-16 flex-col justify-between relative overflow-hidden border-r border-slate-900 antialiased select-none">
        {/* Abstract Dispatch Topology Background */}
        <svg className="absolute inset-0 w-full h-full object-cover opacity-[0.03] pointer-events-none text-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none" stroke="currentColor" strokeWidth="1">
          <circle cx="150" cy="120" r="3" fill="currentColor"/>
          <circle cx="380" cy="220" r="3" fill="currentColor"/>
          <circle cx="580" cy="120" r="3" fill="currentColor"/>
          <circle cx="280" cy="380" r="3" fill="currentColor"/>
          <circle cx="480" cy="420" r="3" fill="currentColor"/>
          <circle cx="680" cy="320" r="3" fill="currentColor"/>
          <line x1="150" y1="120" x2="380" y2="220" />
          <line x1="380" y1="220" x2="580" y2="120" />
          <line x1="150" y1="120" x2="280" y2="380" />
          <line x1="280" y1="380" x2="480" y2="420" />
          <line x1="380" y1="220" x2="480" y2="420" />
          <line x1="580" y1="120" x2="480" y2="420" />
          <line x1="580" y1="120" x2="680" y2="320" />
          <line x1="480" y1="420" x2="680" y2="320" />
          <path d="M50 80 Q 250 30 450 80 T 750 80" fill="none" strokeDasharray="3 3" />
          <path d="M100 450 Q 300 400 500 450 T 700 450" fill="none" strokeDasharray="3 3" />
        </svg>

        <div className="relative flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">{APP_NAME} Control Room</span>
        </div>

        <div className="relative max-w-xl my-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-[32px] md:text-[44px] lg:text-[54px] font-extrabold tracking-[-0.04em] leading-[1.05] text-white">
              Fleet Operations & Dispatch Control.
            </h1>
            <p className="text-base font-normal leading-[1.6] text-slate-400">
              Supervise assets, schedule preventive maintenance, optimize trip dispatch logs, and monitor compliance across your logistics operations.
            </p>
          </div>

          {/* Capability Blocks */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                <Truck size={16} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-white">Live Fleet Visibility</h4>
                <p className="text-xs text-slate-400 mt-1">Real-time coordinate maps and asset health telemetry updates.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                <Route size={16} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-white">Intelligent Dispatch</h4>
                <p className="text-xs text-slate-400 mt-1">Capacity checks and cargo loading optimization protocols.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                <Wrench size={16} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-white">Preventive Maintenance</h4>
                <p className="text-xs text-slate-400 mt-1">Automated workshop ticket scheduling and log registries.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                <Users size={16} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-semibold text-white">Driver Compliance</h4>
                <p className="text-xs text-slate-400 mt-1">Role matrix compliance registers and driving shift tracking.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Status */}
        <div className="relative border-t border-slate-900 pt-6 space-y-3">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest text-left">System Status</p>
          <div className="flex items-center gap-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span>Fleet Services Online</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span>Dispatch Engine Active</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span>Database Connected</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right panel: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-sm space-y-8">
          {/* Brand/Company header on mobile */}
          <div className="text-left">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{APP_NAME}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sign in to Command</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Enter credentials below to access logistics supervision panels.</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Global API error display */}
              {apiError && (
                <div className="p-3 text-xs text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
                  {apiError}
                </div>
              )}

              {/* Email input field */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`
                    w-full px-3.5 py-2.5 text-sm rounded-inputs
                    bg-slate-50 dark:bg-slate-950
                    text-slate-900 dark:text-slate-100
                    border focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500
                    transition-saas
                    ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200/80 dark:border-slate-800'}
                  `}
                  placeholder="admin@transitops.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password input field */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#forgot" className="text-xs text-primary-500 hover:text-primary-600 transition-colors font-semibold">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`
                      w-full pl-3.5 pr-10 py-2.5 text-sm rounded-inputs
                      bg-slate-50 dark:bg-slate-950
                      text-slate-900 dark:text-slate-100
                      border focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500
                      transition-saas
                      ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-200/80 dark:border-slate-800'}
                    `}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Role select field */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="role" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Access Role
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as typeof selectedRole)}
                  className="
                    w-full px-3.5 py-2.5 text-sm rounded-inputs
                    bg-slate-50 dark:bg-slate-950
                    text-slate-900 dark:text-slate-100
                    border border-slate-200/80 dark:border-slate-800
                    focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500
                    transition-saas
                  "
                  disabled={loading}
                >
                  <option value="Admin">Admin</option>
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500/20"
                />
                <label htmlFor="remember" className="text-xs text-slate-500 dark:text-slate-400 select-none">
                  Keep me signed in
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full flex items-center justify-center gap-2
                  px-4 py-2.5 text-sm font-semibold rounded-buttons
                  bg-primary-500 text-white
                  hover:bg-primary-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none transition-saas btn-press shadow-sm shadow-primary-500/10
                "
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LogIn size={14} />
                )}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>

          {/* Credentials guide */}
          <div className="p-4 rounded-xl border border-slate-200/40 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
              Demo: <span className="font-semibold text-slate-600 dark:text-slate-300">admin@transitops.com</span> / <span className="font-semibold text-slate-600 dark:text-slate-300">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
