'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';

type Toast = { id: number; kind: 'success' | 'error'; message: string };

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

// Small, self-contained toast system — no new dependency. A non-technical
// admin should never see a raw thrown error, so every Server Action result
// in the admin surfaces through here as a plain, friendly sentence.
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const push = useCallback((kind: Toast['kind'], message: string) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const value: ToastContextValue = {
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={
              'pointer-events-auto max-w-sm border px-5 py-3 text-sm shadow-lg ' +
              (toast.kind === 'success'
                ? 'border-gold/40 bg-navy text-cream'
                : 'border-gold-deep/40 bg-white text-ink')
            }
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
