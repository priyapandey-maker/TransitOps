import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export default function Loader({ message = 'Loading...', size = 'md', fullPage = false }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const containerClasses = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <Loader2
        className={`animate-spin text-primary-600 dark:text-primary-400 ${sizeClasses[size]}`}
      />
      {message && (
        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
}
