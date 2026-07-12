/**
 * Sidebar — Fixed left navigation panel.
 * Matches the official TransitOps mockup exactly.
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
import { SIDEBAR_NAV, SIDEBAR_BOTTOM_NAV, APP_NAME, APP_DESCRIPTION } from '../../constants/navigation';

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
          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
          transition-colors duration-150
          ${active
            ? 'bg-primary-600 text-white'
            : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
          }
        `}
      >
        {Icon && <Icon size={20} />}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64
          bg-sidebar flex flex-col
          transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">{APP_NAME}</h1>
            <p className="text-xs text-slate-400">{APP_DESCRIPTION}</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {SIDEBAR_NAV.map(renderNavItem)}
        </nav>

        {/* Bottom navigation (Settings) */}
        <div className="px-3 py-4 border-t border-slate-700 space-y-1">
          {SIDEBAR_BOTTOM_NAV.map(renderNavItem)}
        </div>
      </aside>
    </>
  );
}
