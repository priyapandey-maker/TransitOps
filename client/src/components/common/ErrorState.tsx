import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export default function ErrorState({ message = 'An error occurred while loading data.', onRetry, fullPage = false }: ErrorStateProps) {
  const containerClasses = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900'
    : 'flex flex-col items-center justify-center py-12 px-4 text-center';

  return (
    <div className={containerClasses}>
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Failed to load</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}
