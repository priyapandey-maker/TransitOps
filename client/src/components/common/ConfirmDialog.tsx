import Modal from '../ui/Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-5">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700
              text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700
              transition-colors duration-150
            "
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors duration-150
              ${
                isDanger
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
              }
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
