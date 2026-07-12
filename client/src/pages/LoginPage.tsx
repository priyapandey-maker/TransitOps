import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { login as loginService } from '../services/auth.api';
import { loginSchema } from '../types/auth.types';
import type { LoginCredentials } from '../types/auth.types';
import { LogIn, Moon, Sun, Eye, EyeOff, Loader2 } from 'lucide-react';
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

      {/* Left panel: Branding & Fleet operations overview */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white p-16 flex-col justify-between relative overflow-hidden border-r border-slate-800 antialiased">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(91,92,235,0.08),transparent_50%)]" />
        <div className="relative flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-sm font-semibold tracking-wide uppercase text-slate-400">{APP_NAME} Control</span>
        </div>

        <div className="relative max-w-xl my-auto space-y-10">
          <div className="space-y-6">
            <h1 className="text-[36px] md:text-[48px] lg:text-[64px] font-extrabold tracking-[-0.04em] leading-[1.05] text-white">
              Fleet Operations & Dispatch Control.
            </h1>
            <p className="text-[22px] font-normal leading-[1.7] text-white/70">
              Supervise assets, schedule preventive maintenance, optimize trip dispatch logs, and monitor workforce compliance in real-time.
            </p>
          </div>

          <div className="space-y-4 border-l-2 border-primary-500 pl-6">
            <div className="space-y-3 text-lg font-medium text-slate-300">
              <p className="font-semibold text-white">Active Operational Supervision</p>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>Real-time capacity and load calculations</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>Preventive lifecycle maintenance scheduling</span>
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>Role-based access control registries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} TransitOps Inc. All rights reserved.
        </div>
      </div>

      {/* Right panel: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm">
          {/* Brand/Company header on mobile */}
          <div className="text-left mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">{APP_NAME}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sign in to Control Room</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Enter credentials below to access logistics supervision panels.</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Global API error display */}
              {apiError && (
                <div className="p-3 text-xs text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
                  {apiError}
                </div>
              )}

              {/* Email input field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
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
                  <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>
                )}
              </div>

              {/* Password input field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#forgot" className="text-xs text-primary-500 hover:text-primary-600 transition-colors font-medium">
                    Forgot?
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
                  <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>
                )}
              </div>

              {/* Role select field */}
              <div>
                <label htmlFor="role" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
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
          <div className="mt-6 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal">
              Demo: <span className="font-semibold text-slate-600 dark:text-slate-300">admin@transitops.com</span> / <span className="font-semibold text-slate-600 dark:text-slate-300">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
