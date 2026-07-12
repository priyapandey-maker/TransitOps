import type { StatusVariant } from '../../types/common.types';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Normalize status string to match StatusVariant mapping
  const normalized = status.toLowerCase().replace(/\s+/g, '-') as StatusVariant;

  const getBadgeStyles = (variant: StatusVariant) => {
    switch (variant) {
      case 'available':
      case 'active':
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30';
      case 'on-trip':
      case 'dispatched':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      case 'in-shop':
      case 'open':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30';
      case 'draft':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30';
      case 'cancelled':
      case 'suspended':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30';
      case 'retired':
      case 'off-duty':
      case 'inactive':
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600/50';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-badges text-[11px] font-medium tracking-wide border transition-saas
        ${getBadgeStyles(normalized)}
      `}
    >
      {status}
    </span>
  );
}
