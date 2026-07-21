'use client';

import { useState } from 'react';

/**
 * Generic "are you sure?" confirmation used before every delete in the
 * admin (sermons, events, media library images).
 */
export function ConfirmDialog({
  triggerLabel,
  title,
  description,
  confirmLabel = 'Delete',
  onConfirm,
  triggerClassName,
}: {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          'font-sans text-xs font-semibold uppercase tracking-widest text-ink/60 transition-colors hover:text-gold-deep'
        }
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 px-4">
          <div className="w-full max-w-sm border border-gold/20 bg-white p-6">
            <h2 className="font-display text-h4 font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-sm text-ink/70">{description}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={busy}
                className="px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-ink/70 hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={busy}
                className="bg-gold-deep px-5 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:opacity-90 disabled:opacity-60"
              >
                {busy ? 'Deleting…' : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
