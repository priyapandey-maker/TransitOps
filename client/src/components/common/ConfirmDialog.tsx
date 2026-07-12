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
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="
              px-4 py-2.5 text-sm font-medium rounded-buttons border border-slate-200 dark:border-slate-800
              text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800
              transition-saas btn-press
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
              px-4 py-2.5 text-sm font-medium rounded-buttons text-white transition-saas btn-press
              ${
                isDanger
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-primary-500 hover:bg-primary-600'
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
