import { cn } from '@/lib/utils';

type SectionTone = 'cream' | 'navy' | 'navy-elevated' | 'transparent';

// The site alternates two base tones for its premium light/dark rhythm — the
// actual color values live in one place (globals.css's :root block and
// tailwind.config.ts's `navy`/`cream` tokens).
const toneStyles: Record<SectionTone, string> = {
  cream: 'bg-cream text-ink',
  navy: 'bg-navy text-white',
  'navy-elevated': 'bg-navy-elevated text-white',
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
    <section
      id={id}
      data-tone={tone}
      className={cn('py-24 md:py-32', toneStyles[tone], className)}
    >
      {children}
    </section>
  );
}
