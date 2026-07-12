/**
 * TopBar — Header bar with search, user info, theme toggle, and logout.
 * Matches the official TransitOps mockup.
 * Consistent across every authenticated page.
 */

import { Menu, Search, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, userRole, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left: Menu button (mobile) + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Search bar */}
          <div className="hidden sm:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="
                  w-full pl-9 pr-4 py-2 text-sm rounded-lg
                  bg-slate-100 dark:bg-slate-700
                  text-slate-900 dark:text-slate-100
                  placeholder-slate-400 dark:placeholder-slate-500
                  border border-transparent
                  focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
                "
              />
            </div>
          </div>
        </div>

        {/* Right: Theme toggle + User + Logout */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-700 dark:text-slate-300">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <User size={16} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium leading-tight">
                {currentUser?.fullName ?? 'Guest'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                {userRole ?? 'Not logged in'}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
