import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'inverse';

type ButtonBaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseStyles =
  'inline-flex items-center justify-center px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] transition-colors duration-300';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gold text-crimson-deep hover:bg-gold-light',
  secondary: 'border border-gold text-gold hover:bg-gold hover:text-crimson-deep',
  outline: 'border border-ink/30 text-ink hover:bg-ink hover:text-cream',
  inverse: 'bg-crimson-deep text-cream hover:bg-crimson',
};

export function Button({ variant = 'primary', className, children, href, ...props }: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
