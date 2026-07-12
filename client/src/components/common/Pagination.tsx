import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl">
      {/* Items count */}
      <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{startIdx}</span> to{' '}
        <span className="font-semibold text-slate-800 dark:text-slate-200">{endIdx}</span> of{' '}
        <span className="font-semibold text-slate-800 dark:text-slate-200">{totalItems}</span> entries
      </div>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            p-1.5 rounded-lg border border-slate-200 dark:border-slate-700
            text-slate-600 dark:text-slate-400
            hover:bg-slate-50 dark:hover:bg-slate-700
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
            transition-colors duration-150
          "
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`
                px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium border transition-colors duration-150
                ${
                  isActive
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }
              `}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            p-1.5 rounded-lg border border-slate-200 dark:border-slate-700
            text-slate-600 dark:text-slate-400
            hover:bg-slate-50 dark:hover:bg-slate-700
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent
            transition-colors duration-150
          "
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
