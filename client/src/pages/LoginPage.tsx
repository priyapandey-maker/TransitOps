/**
 * Login Page — placeholder for Sprint 1 implementation.
 * Will include: Login form, email/password fields, Zod validation, API integration.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogIn, Moon, Sun } from 'lucide-react';
import { APP_NAME, APP_DESCRIPTION } from '../constants/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // TODO (Sprint 1): Replace with actual API call to POST /api/auth/login
    // Temporary mock login for layout verification
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (email === 'admin@transitops.com' && password === 'admin123') {
        login('mock-jwt-token', {
          userId: 1,
          fullName: 'Admin User',
          email: 'admin@transitops.com',
          role: 'Admin',
        });
        navigate('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{APP_NAME}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{APP_DESCRIPTION}</p>
        </div>

        {/* Login card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error message */}
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  w-full px-3 py-2 text-sm rounded-lg
                  bg-white dark:bg-slate-700
                  text-slate-900 dark:text-slate-100
                  border border-slate-300 dark:border-slate-600
                  focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                "
                placeholder="admin@transitops.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  w-full px-3 py-2 text-sm rounded-lg
                  bg-white dark:bg-slate-700
                  text-slate-900 dark:text-slate-100
                  border border-slate-300 dark:border-slate-600
                  focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                "
                placeholder="••••••••"
              />
            </div>

            {/* Submit */}
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
              "
            >
              <LogIn size={16} />
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
          Demo: admin@transitops.com / admin123
        </p>
      </div>
    </div>
  );
}
