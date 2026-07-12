/**
 * TopBar — Header bar with search, user info, theme toggle, and logout.
 * Matches the official TransitOps mockup.
 * Consistent across every authenticated page.
 */

import { useState } from 'react';
import { Menu, Moon, Sun, LogOut, User } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();
  const { currentUser, userRole, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Menu button (mobile) + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-buttons text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 transition-saas btn-press"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Search bar */}
          <div className="hidden sm:flex items-center flex-1 max-w-sm group">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Quick search..." 
            />
          </div>
        </div>

        {/* Right: Theme toggle + User + Logout */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-buttons text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 border border-slate-200/40 dark:border-slate-800 transition-saas btn-press"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 border border-slate-200/40 dark:border-slate-800 rounded-full text-xs text-slate-700 dark:text-slate-300">
            <div className="w-6 h-6 rounded-full bg-primary-50 dark:bg-primary-950 flex items-center justify-center border border-primary-100 dark:border-primary-900">
              <User size={13} className="text-primary-500 dark:text-primary-400" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {currentUser?.fullName ?? 'Guest'}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                {userRole ?? 'Not logged in'}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 rounded-buttons text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/20 dark:hover:text-red-400 border border-slate-200/40 dark:border-slate-800 hover:border-red-100 transition-saas btn-press"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
