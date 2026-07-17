'use client';

import { useState } from 'react';

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled the native share sheet — fall through to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="border border-gold px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-crimson transition-colors hover:bg-gold hover:text-crimson-deep"
    >
      {copied ? 'Link Copied' : 'Share'}
    </button>
  );
}
