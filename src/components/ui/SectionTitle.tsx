import { cn } from '@/lib/utils';

export function SectionTitle({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: string;
  /** Optional second headline line, set in gold — the Summit-style
   * two-tone editorial headline. Omit for a single-line title (default,
   * used by most existing sections). */
  titleAccent?: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'mb-4 flex items-center gap-3',
            align === 'center' ? 'justify-center' : 'justify-start'
          )}
        >
          {align === 'center' && <span aria-hidden className="h-px w-8 bg-accent/50" />}
          <p className="text-eyebrow font-semibold uppercase text-accent">{eyebrow}</p>
          <span aria-hidden className="h-px w-8 bg-accent/50" />
        </div>
      )}
      <h2 className="font-display text-h2 font-semibold leading-[1.08]">
        {title}
        {titleAccent && (
          <>
            <br />
            <span className="text-accent">{titleAccent}</span>
          </>
        )}
      </h2>
      {subtitle && <p className="mx-auto mt-5 max-w-2xl text-body opacity-80">{subtitle}</p>}
    </div>
  );
}
