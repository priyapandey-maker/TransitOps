import StatusBadge from '../tables/StatusBadge';

export interface HistoryItem {
  id: string | number;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  status?: string;
  badgeContent?: string;
}

interface ServiceHistoryProps {
  items: HistoryItem[];
  emptyMessage?: string;
}

export default function ServiceHistory({
  items,
  emptyMessage = 'No service history recorded for this resource.',
}: ServiceHistoryProps) {
  if (items.length === 0) {
    return (
      <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
        <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </div>
    );
  }

  // Sort chronological order (latest first)
  const sortedItems = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 pl-6 space-y-6 py-2">
      {sortedItems.map((item) => (
        <div key={item.id} className="relative">
          {/* Bullet node indicator */}
          <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white dark:bg-slate-800 border-2 border-primary-500 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
          </span>

          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md">
                  {item.date}
                </span>
                {item.status && <StatusBadge status={item.status} />}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
