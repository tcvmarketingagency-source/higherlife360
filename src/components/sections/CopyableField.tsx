'use client';

import { useState } from 'react';

export function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 border border-ink/10 bg-cream px-4 py-3">
      <div className="min-w-0">
        <p className="font-sans text-xs uppercase tracking-widest text-ink/70">{label}</p>
        <p className="mt-0.5 truncate font-sans text-sm text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex-shrink-0 font-sans text-xs font-semibold uppercase tracking-widest text-navy-elevated hover:text-gold-deep"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
