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
import { APP_NAME, APP_DESCRIPTION } from '../constants/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
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
        login(token, user);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-200">
      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="w-full max-w-sm">
        {/* Brand/Company header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            TO
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">{APP_NAME}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{APP_DESCRIPTION}</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Global API error display */}
            {apiError && (
              <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-lg">
                {apiError}
              </div>
            )}

            {/* Email input field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`
                  w-full px-3 py-2 text-sm rounded-lg
                  bg-white dark:bg-slate-700
                  text-slate-900 dark:text-slate-100
                  border transition-colors duration-150
                  focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                  ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600'}
                `}
                placeholder="admin@transitops.com"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password input field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`
                    w-full pl-3 pr-10 py-2 text-sm rounded-lg
                    bg-white dark:bg-slate-700
                    text-slate-900 dark:text-slate-100
                    border transition-colors duration-150
                    focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500
                    ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-300 dark:border-slate-600'}
                  `}
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-2.5 text-sm font-medium rounded-lg
                bg-primary-600 text-white
                hover:bg-primary-700
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                dark:focus:ring-offset-slate-800
                transition-colors duration-150
              "
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Credentials guide */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          Demo: admin@transitops.com / admin123
        </p>
      </div>
    </div>
  );
}
