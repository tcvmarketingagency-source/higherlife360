'use client';

import { cn } from '@/lib/utils';
import { ABOUT_COLOR_PALETTE, ABOUT_STORY_BACKGROUND_HEX, contrastRatio, passesAA } from '@/lib/about-colors';

/**
 * Curated 20-swatch color picker — not a free-form color input. Every
 * swatch's contrast against the Our Story section's actual cream
 * background is computed and shown live; any swatch that fails WCAG AA
 * (4.5:1) is visibly disabled and cannot be selected at all — "warn and
 * still allow" isn't enough given the brief ("must not be able to make
 * text unreadable"), so this blocks it outright rather than just flagging
 * it. In practice every curated color here was chosen to already pass, so
 * you should never actually see a disabled swatch — but the check runs
 * for real, not just as a decorative label.
 */
export function ColorPickerField({
  label,
  value,
  onChange,
  previewText,
  previewClassName,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  previewText: string;
  previewClassName?: string;
}) {
  return (
    <div>
      <p className="font-sans text-sm font-semibold text-ink">{label}</p>
      <p className="mt-1 text-xs text-ink/50">
        Used for the Our Story section, set against our cream background — only colors that pass
        WCAG AA contrast can be selected.
      </p>

      <div
        className="mt-3 border border-ink/10 p-4"
        style={{ backgroundColor: ABOUT_STORY_BACKGROUND_HEX }}
      >
        <p style={{ color: value }} className={cn('font-semibold', previewClassName)}>
          {previewText}
        </p>
        <p className="mt-1 text-xs" style={{ color: value }}>
          Live preview against the actual section background — {contrastRatio(value, ABOUT_STORY_BACKGROUND_HEX).toFixed(2)}:1 contrast.
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
        {ABOUT_COLOR_PALETTE.map((swatch) => {
          const ratio = contrastRatio(swatch.hex, ABOUT_STORY_BACKGROUND_HEX);
          const ok = passesAA(swatch.hex);
          const selected = value.toLowerCase() === swatch.hex.toLowerCase();
          return (
            <button
              key={swatch.key}
              type="button"
              disabled={!ok}
              onClick={() => onChange(swatch.hex)}
              title={
                ok
                  ? `${swatch.name} — ${ratio.toFixed(2)}:1 (passes AA)`
                  : `${swatch.name} — ${ratio.toFixed(2)}:1 (fails AA — not selectable)`
              }
              className={cn(
                'group relative flex flex-col items-center gap-1 border p-2 text-center transition-colors',
                selected ? 'border-gold ring-2 ring-gold/50' : 'border-ink/10',
                !ok && 'cursor-not-allowed opacity-30'
              )}
            >
              <span
                className="h-8 w-8 flex-shrink-0 rounded-full border border-ink/10"
                style={{ backgroundColor: swatch.hex }}
                aria-hidden
              />
              <span className="text-[10px] leading-tight text-ink/70">{swatch.name}</span>
              {!ok && <span className="text-[9px] font-semibold text-red-600">Fails contrast</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
