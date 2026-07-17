'use client';

import { useLenis } from '@/components/providers/smooth-scroll';
import { useConnectCardPrefill } from './JoinPageProvider';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'inverse';

// Mirrors src/components/ui/Button.tsx's exact styling so this reads as the
// same design-system button, even though it needs to be a plain <button>
// with an onClick handler (scroll + prefill) rather than a Link.
const baseStyles =
  'inline-flex items-center justify-center px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] transition-colors duration-300';

const variantStyles: Record<Variant, string> = {
  primary: 'bg-gold text-crimson-deep hover:bg-gold-light',
  secondary: 'border border-gold text-gold hover:bg-gold hover:text-crimson-deep',
  outline: 'border border-ink/30 text-ink hover:bg-ink hover:text-cream',
  inverse: 'bg-crimson-deep text-cream hover:bg-crimson',
};

export function JoinActionButton({
  target,
  interest,
  note,
  variant = 'primary',
  className,
  children,
}: {
  target: string;
  interest?: string;
  note?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  const lenis = useLenis();
  const { requestPrefill } = useConnectCardPrefill();

  function handleClick() {
    if (interest) requestPrefill(interest, note);

    if (lenis) {
      lenis.scrollTo(target, { offset: -100, duration: 1.4 });
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </button>
  );
}
