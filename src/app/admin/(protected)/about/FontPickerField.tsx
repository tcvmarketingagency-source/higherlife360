'use client';

import { cn } from '@/lib/utils';
import { FONT_PAIRINGS } from '@/lib/about-fonts';

/**
 * Curated font-pairing picker — deliberately NOT a free-text font name
 * field or a Google Fonts dropdown. Every option here is one of the fixed
 * pairings in src/lib/about-fonts.ts, each rendered in its own real
 * self-hosted typeface (via the CSS variables loaded in this route's
 * layout.tsx) so what you see is exactly what the Our Story section will
 * look like — not a generic label.
 */
export function FontPickerField({
  value,
  onChange,
}: {
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {FONT_PAIRINGS.map((pairing) => {
        const selected = value === pairing.key;
        return (
          <button
            key={pairing.key}
            type="button"
            onClick={() => onChange(pairing.key)}
            className={cn(
              'border p-4 text-left transition-colors',
              selected ? 'border-gold bg-gold/5' : 'border-ink/15 hover:border-ink/30'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-sans text-sm font-semibold text-ink">{pairing.label}</p>
              <span
                className={cn(
                  'flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border',
                  selected ? 'border-gold bg-gold' : 'border-ink/30'
                )}
                aria-hidden
              >
                {selected && <span className="h-1.5 w-1.5 rounded-full bg-navy" />}
              </span>
            </div>
            <p
              style={{ fontFamily: `var(${pairing.headingVar})` }}
              className="mt-2 text-xl font-semibold text-ink"
            >
              {pairing.headingSample}
            </p>
            <p style={{ fontFamily: `var(${pairing.bodyVar})` }} className="mt-1 text-sm text-ink/70">
              {pairing.bodySample}
            </p>
            <p className="mt-2 text-xs text-ink/50">{pairing.description}</p>
          </button>
        );
      })}
    </div>
  );
}
