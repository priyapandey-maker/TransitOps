import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title = 'No records found',
  description = 'There are no active records in this section.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-cards bg-white dark:bg-slate-900/40">
      <div className="flex items-center justify-center h-14 w-14 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-5 border border-slate-100 dark:border-slate-700/50">
        {icon || <AlertCircle size={24} />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
