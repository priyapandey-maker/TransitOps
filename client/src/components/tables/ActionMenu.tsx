import { useState, useEffect, useRef } from 'react';
import { MoreVertical } from 'lucide-react';
import type { ReactNode } from 'react';

export interface ActionMenuItem {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
  icon?: ReactNode;
}

interface ActionMenuProps {
  actions: ActionMenuItem[];
}

export default function ActionMenu({ actions }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700
          text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200
          transition-colors duration-150 focus:outline-none
        "
        aria-label="Actions Menu"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          className="
            absolute right-0 mt-1.5 w-40 origin-top-right rounded-lg border border-slate-200 dark:border-slate-700
            bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-lg z-10 focus:outline-none
            divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden
          "
        >
          <div className="py-1">
            {actions.map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  act.onClick();
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-150
                  hover:bg-slate-50 dark:hover:bg-slate-700/60
                  ${
                    act.isDanger
                      ? 'text-red-600 hover:text-red-700 dark:text-red-400'
                      : 'text-slate-700 dark:text-slate-300'
                  }
                `}
              >
                {act.icon && <span className="text-slate-400 dark:text-slate-500">{act.icon}</span>}
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
