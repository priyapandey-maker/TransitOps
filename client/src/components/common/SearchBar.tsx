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
    <div className="relative flex-1">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-10 py-2 text-sm rounded-lg
          bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          border border-slate-200 dark:border-slate-700
          focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500
          transition-colors duration-150
        "
      />
      {localValue && (
        <button
          type="button"
          onClick={() => setLocalValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
