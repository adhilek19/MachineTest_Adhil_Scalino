import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

export function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#24251F]/50 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!isLoading) onCancel();
        }}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div
        className="relative w-full max-w-md bg-white border border-[#E2DCCE] shadow-2xl z-10 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between p-6 border-b border-[#E2DCCE] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 flex items-center justify-center ${
                isDestructive ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-[#EBF0EA] text-[#435640] border border-[#D2DEC1]'
              }`}
            >
              <AlertTriangle className="w-4 h-4 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-xl text-[#24251F] leading-snug">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="p-1.5 text-[#24251F]/40 hover:text-[#24251F] hover:bg-[#24251F]/5 transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        <div className="p-6 text-sm text-[#24251F]/70 leading-relaxed font-light">
          {message}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#FAF8F5] border-t border-[#E2DCCE]">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
