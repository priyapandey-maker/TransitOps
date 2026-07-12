import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export default function SearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  debounceMs = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync internal state with prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search trigger
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localValue, onChange, debounceMs]);

  return (
    <div className="relative flex-1 group">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-primary-500"
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-11 pr-12 py-2.5 text-sm rounded-full
          bg-white dark:bg-slate-900
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          border border-slate-200 dark:border-slate-800
          focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10
          transition-saas
        "
      />
      {localValue ? (
        <button
          type="button"
          onClick={() => setLocalValue('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors btn-press"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      ) : (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-[10px] font-mono text-slate-400 dark:text-slate-500 select-none">
          <span>⌘</span>
          <span>K</span>
        </span>
      )}
    </div>
  );
}
