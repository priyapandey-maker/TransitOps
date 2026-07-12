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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-slate-200 dark:border-slate-700/80 rounded-xl bg-white dark:bg-slate-800/40">
      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4 border border-slate-200 dark:border-slate-700">
        {icon || <AlertCircle size={24} />}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
