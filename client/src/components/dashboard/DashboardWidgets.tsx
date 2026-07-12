/**
 * Reusable Dashboard Building Blocks
 *
 * Six generic card components used by every role‑specific dashboard layout.
 * Each accepts data via props — zero business logic inside.
 */

import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight, AlertCircle } from 'lucide-react';

/* ─────────────────────────────────────────────────────
 * 1. MetricCard — KPI number with icon, trend, subtitle
 * ───────────────────────────────────────────────────── */

export interface MetricCardProps {
  label: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  /** Tailwind color classes for the icon badge */
  iconColor: string;
  /** Optional trend indicator e.g. "+5%" or "−2 since yesterday" */
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export function MetricCard({ label, value, subtitle, icon: Icon, iconColor, trend, trendDirection }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-saas group">
      <div className="flex items-start justify-between">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 leading-none">{value}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 pt-1 font-medium">{subtitle}</p>
          {trend && (
            <span className={`inline-block text-[10px] font-semibold mt-1 ${
              trendDirection === 'up' ? 'text-green-600 dark:text-green-400' :
              trendDirection === 'down' ? 'text-red-600 dark:text-red-400' :
              'text-slate-400'
            }`}>{trend}</span>
          )}
        </div>
        <div className={`p-3 rounded-xl transition-saas group-hover:scale-105 ${iconColor}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
 * 2. ChartCard — Placeholder for chart content
 * ───────────────────────────────────────────────────── */

export interface ChartCardProps {
  title: string;
  icon?: LucideIcon;
  /** Chart bars rendered as simple horizontal progress bars */
  data: { label: string; value: number; max: number; color: string }[];
}

export function ChartCard({ title, icon: Icon, data }: ChartCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        {Icon && <Icon size={18} className="text-primary-500" />}
        {title}
      </h3>
      <div className="space-y-4">
        {data.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600 dark:text-slate-400">{row.label}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{row.value}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${row.color}`}
                style={{ width: `${Math.min((row.value / row.max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
 * 3. TimelineCard — Activity log / event stream
 * ───────────────────────────────────────────────────── */

export interface TimelineEvent {
  time: string;
  actor: string;
  event: string;
}

export interface TimelineCardProps {
  title: string;
  events: TimelineEvent[];
}

export function TimelineCard({ title, events }: TimelineCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
      <div className="relative border-l border-slate-100 dark:border-slate-800 pl-4 space-y-5 py-1">
        {events.map((evt, idx) => (
          <div key={idx} className="relative text-xs">
            <span className="absolute -left-[20.5px] top-1.5 h-2 w-2 rounded-full bg-primary-500 ring-4 ring-white dark:ring-slate-900" />
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <span>{evt.actor}</span>
              <span>{evt.time}</span>
            </div>
            <p className="font-medium text-slate-700 dark:text-slate-300 mt-1">{evt.event}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
 * 4. AlertCard — Priority alerts with semantic severity
 * ───────────────────────────────────────────────────── */

export interface Alert {
  id: number;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
}

export interface AlertCardProps {
  title: string;
  alerts: Alert[];
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: 'bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/20 text-red-800 dark:text-red-300',
  warning: 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/20 text-amber-800 dark:text-amber-300',
  info: 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/20 text-blue-800 dark:text-blue-300',
};

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30',
  warning: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30',
  info: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
};

export function AlertCard({ title, alerts }: AlertCardProps) {
  const highestSeverity = alerts.some(a => a.severity === 'critical') ? 'critical' :
                          alerts.some(a => a.severity === 'warning') ? 'warning' : 'info';
  const badgeLabel = highestSeverity === 'critical' ? 'Action Required' :
                     highestSeverity === 'warning' ? 'Review Needed' : 'Informational';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertCircle size={18} className={highestSeverity === 'critical' ? 'text-red-500' : highestSeverity === 'warning' ? 'text-amber-500' : 'text-blue-500'} />
          {title}
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${SEVERITY_BADGE[highestSeverity]}`}>{badgeLabel}</span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${SEVERITY_STYLES[alert.severity]}`}>
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{alert.message}</p>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
 * 5. TableCard — Compact data table inside a card
 * ───────────────────────────────────────────────────── */

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

export interface TableRow {
  [key: string]: string | number;
}

export interface StatusConfig {
  [value: string]: string;
}

export interface TableCardProps {
  title: string;
  icon?: LucideIcon;
  columns: TableColumn[];
  rows: TableRow[];
  /** Link to a "View All" page */
  viewAllLink?: string;
  /** Column key to render as a status badge */
  statusColumn?: string;
  /** Map status values → Tailwind colour classes */
  statusColors?: StatusConfig;
}

export function TableCard({ title, icon: Icon, columns, rows, viewAllLink, statusColumn, statusColors }: TableCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          {Icon && <Icon size={18} className="text-primary-500" />}
          {title}
        </h3>
        {viewAllLink && (
          <Link to={viewAllLink} className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase text-slate-400 pb-2">
              {columns.map(col => (
                <th key={col.key} className={`py-2.5 ${col.align === 'right' ? 'text-right' : ''}`}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/30 transition-saas">
                {columns.map(col => {
                  const cellVal = String(row[col.key] ?? '');
                  const isStatus = statusColumn === col.key && statusColors != null;
                  const resolvedColor = isStatus && statusColors ? (statusColors[cellVal] ?? 'bg-slate-50 text-slate-600 border-slate-200') : '';
                  return (
                    <td key={col.key} className={`py-3 ${col.align === 'right' ? 'text-right' : ''} ${col.key === columns[0]?.key ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                      {isStatus ? (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${resolvedColor}`}>
                          {cellVal}
                        </span>
                      ) : cellVal}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
 * 6. QuickActionsCard — Grid of shortcut action buttons
 * ───────────────────────────────────────────────────── */

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  to: string;
}

export interface QuickActionsCardProps {
  title: string;
  actions: QuickAction[];
}

export function QuickActionsCard({ title, actions }: QuickActionsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-cards border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(action => (
          <Link
            key={action.label}
            to={action.to}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 hover:border-primary-100 dark:hover:border-primary-900 transition-saas text-center btn-press group"
          >
            <action.icon size={18} className="text-primary-500 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-slate-900 dark:text-white">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
