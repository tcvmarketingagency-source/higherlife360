import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outline-light' | 'inverse';

type ButtonBaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  /** Adds a trailing arrow that nudges right on hover — the consistent
   * editorial CTA treatment. Opt-in so existing buttons are unaffected. */
  showArrow?: boolean;
};

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  'group/btn inline-flex items-center justify-center gap-2 px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] transition-colors duration-300';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-navy hover:bg-gold-light',
  secondary: 'border border-gold text-gold hover:bg-gold hover:text-navy',
  outline: 'border border-ink/30 text-ink hover:bg-ink hover:text-cream',
  // Same "outline" treatment as above, recolored for use on dark
  // (navy-elevated) backgrounds — `outline` itself stays ink-based since it's
  // still used on light/cream sections elsewhere in the site.
  'outline-light': 'border border-cream/40 text-cream hover:bg-cream hover:text-navy',
  inverse: 'bg-navy text-cream hover:bg-navy-elevated',
};

function ButtonArrow() {
  return (
    <span
      aria-hidden
      className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1"
    >
      &rarr;
    </span>
  );
}

export function Button({
  variant = 'primary',
  className,
  children,
  href,
  showArrow,
  ...props
}: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
        {showArrow && <ButtonArrow />}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
      {showArrow && <ButtonArrow />}
    </button>
  );
}
