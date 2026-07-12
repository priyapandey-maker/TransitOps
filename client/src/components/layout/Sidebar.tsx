/**
 * Sidebar — Fixed left navigation panel.
 * Role‑aware: displays only the modules relevant to the authenticated user.
 * Desktop: fixed visible | Tablet: collapsible | Mobile: drawer
 */

import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ROLE_NAV, SIDEBAR_BOTTOM_NAV, APP_NAME, APP_DESCRIPTION } from '../../constants/navigation';
import { useAuth } from '../../context/AuthContext';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { userRole } = useAuth();

  // Get role-specific navigation items; fall back to Admin if role is unknown
  const navItems = ROLE_NAV[userRole ?? 'Admin'] ?? ROLE_NAV['Admin'];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const renderNavItem = (item: { label: string; path: string; icon: string }) => {
    const Icon = ICON_MAP[item.icon];
    const active = isActive(item.path);

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onClose}
        className={`
          flex items-center gap-3 px-3.5 py-2.5 rounded-buttons text-sm font-medium transition-saas btn-press
          ${active
            ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/5 border-l-2 border-primary-500 pl-2.5'
            : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
          }
        `}
      >
        {Icon && <Icon size={18} className={active ? 'text-primary-400' : 'text-slate-400'} />}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-slate-900 border-r border-slate-800 flex flex-col
          transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
              <h1 className="text-base font-bold text-white tracking-tight leading-none">{APP_NAME}</h1>
            </div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-1.5">{APP_DESCRIPTION}</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        {userRole && (
          <div className="px-6 pt-4 pb-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary-500/10 text-primary-400 border border-primary-500/20">
              {userRole}
            </span>
          </div>
        )}

        {/* Main navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map(renderNavItem)}
        </nav>

        {/* Bottom navigation (Settings) */}
        <div className="px-4 py-5 border-t border-slate-800 space-y-1.5">
          {SIDEBAR_BOTTOM_NAV.map(renderNavItem)}
        </div>
      </aside>
    </>
  );
}
