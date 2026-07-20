import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Ministry } from '@/lib/ministries-data';

export function MinistriesShowcase({
  items,
  tone = 'light',
}: {
  items: Ministry[];
  /** 'light' (default, unchanged) keeps the current ink-bordered card for
   * /ministries. 'dark' swaps the card border for the navy-elevated-base theme
   * (homepage, Phase 1) — opt-in so /ministries is untouched until approved. */
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((ministry) => (
        <Link
          key={ministry.slug}
          id={ministry.slug}
          href={`/ministries#${ministry.slug}`}
          className={cn(
            'group relative block aspect-[3/4] scroll-mt-24 overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_40px_-10px_rgba(232,163,61,0.5)]',
            dark ? 'border-cream/10' : 'border-ink/10'
          )}
        >
          <Image
            src={ministry.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Strong, tall dark scrim — the text block below can run 3-4
              lines depending on ministry name/description length, so the
              "via" stop needs to stay dark well past the card's midpoint,
              not just at the very bottom edge. */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/75 to-ink/25" />
          <div className="relative flex h-full flex-col justify-end p-6">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-gold [text-shadow:0_1px_8px_rgb(0_0_0_/_70%)]">
              {ministry.audience}
            </p>
            <h3 className="mt-2 font-display text-h4 font-semibold text-cream transition-colors group-hover:text-gold-light">
              {ministry.name}
            </h3>
            <p className="mt-2 text-sm text-cream/80">{ministry.description}</p>
            <span
              aria-hidden
              className="mt-4 inline-block text-gold transition-transform group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
