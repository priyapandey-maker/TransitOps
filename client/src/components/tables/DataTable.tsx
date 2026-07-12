import type { ReactNode } from 'react';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: (row: T) => ReactNode;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function DataTable<T extends { id: number | string }>({
  data,
  columns,
  actions,
  loading = false,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden shadow-sm">
        <Loader message="Loading records..." />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${
                    col.className || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
            {data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150"
              >
                {columns.map((col, idx) => {
                  const content =
                    typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as ReactNode);

                  return (
                    <td
                      key={idx}
                      className={`px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300 ${
                        col.className || ''
                      }`}
                    >
                      {content}
                    </td>
                  );
                })}
                {actions && (
                  <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300 text-right whitespace-nowrap">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
