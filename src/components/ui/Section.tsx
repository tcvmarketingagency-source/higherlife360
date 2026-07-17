import { cn } from '@/lib/utils';

type SectionTone = 'cream' | 'crimson' | 'crimson-deep' | 'transparent';

const toneStyles: Record<SectionTone, string> = {
  cream: 'bg-cream text-ink',
  crimson: 'bg-crimson text-cream',
  'crimson-deep': 'bg-crimson-deep text-cream',
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
    <section id={id} className={cn('py-20 md:py-28', toneStyles[tone], className)}>
      {children}
    </section>
  );
}
