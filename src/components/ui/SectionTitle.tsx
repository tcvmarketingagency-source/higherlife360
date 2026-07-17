import { cn } from '@/lib/utils';

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && <p className="mb-3 text-eyebrow font-semibold uppercase text-gold">{eyebrow}</p>}
      <h2 className="font-display text-h2 font-semibold">{title}</h2>
      {subtitle && <p className="mt-4 text-body opacity-80">{subtitle}</p>}
    </div>
  );
}
