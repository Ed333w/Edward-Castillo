'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={onCancel}
      className="m-auto w-full max-w-sm rounded-xl border border-(--border) bg-(--surface) p-0 text-(--foreground) backdrop:bg-black/40"
    >
      <div className="p-5">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="mt-2 text-sm text-(--muted)">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-(--foreground) hover:bg-(--surface-hover)"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              danger
                ? 'rounded-lg bg-(--danger) px-3 py-1.5 text-sm font-medium text-white'
                : 'rounded-lg bg-(--primary) px-3 py-1.5 text-sm font-medium text-(--primary-foreground)'
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
