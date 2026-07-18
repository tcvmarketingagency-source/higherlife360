import { cn } from '@/lib/utils';

type SectionTone =
  'cream' | 'crimson' | 'crimson-deep' | 'charcoal' | 'charcoal-deep' | 'transparent';

// "charcoal"/"charcoal-deep" are the new luxury dark-base tones (Phase 1:
// homepage only). Once approved, rolling the theme out to the rest of the
// site is just swapping each page's `tone="crimson-deep"` /
// `tone="crimson"` to the charcoal equivalents below — the actual color
// values live in one place (tailwind.config.ts's `charcoal` token).
const toneStyles: Record<SectionTone, string> = {
  cream: 'bg-cream text-ink',
  crimson: 'bg-crimson text-cream',
  'crimson-deep': 'bg-crimson-deep text-cream',
  charcoal: 'bg-charcoal text-cream',
  'charcoal-deep': 'bg-charcoal-deep text-cream',
  transparent: '',
};

export function Section({
  id,
  tone = 'transparent',
  className,
  children,
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn('py-24 md:py-32', toneStyles[tone], className)}>
      {children}
    </section>
  );
}
