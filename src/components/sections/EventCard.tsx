import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { EVENT_PHOTO_PLACEHOLDERS } from '@/lib/unsplash-placeholders';
import { formatEventDateTimeRange, isPastEvent } from '@/lib/event-time';
import type { EventRow } from '@/lib/database.types';

function fallbackPhoto(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return EVENT_PHOTO_PLACEHOLDERS[hash % EVENT_PHOTO_PLACEHOLDERS.length];
}

export function EventCard({
  event,
  branchName,
  tone = 'light',
}: {
  event: EventRow;
  branchName?: string | null;
  /** 'light' (default, unchanged) is the white card used on /events and
   * event-detail pages. 'dark' is the navy-elevated-base card variant for
   * sections that have migrated to the new luxury dark theme (homepage,
   * Phase 1) — kept opt-in so other pages aren't affected until approved. */
  tone?: 'light' | 'dark';
}) {
  const photo = event.image_url ?? fallbackPhoto(event.id);
  const past = isPastEvent(event);
  const detailsHref = `/events/${event.id}`;
  const isExternalRegister = Boolean(event.register_url);
  const dark = tone === 'dark';

  return (
    <div
      className={cn(
        'group overflow-hidden border border-gold/20 transition-all duration-300',
        dark ? 'bg-navy-elevated' : 'bg-white',
        past
          ? 'opacity-60'
          : 'hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_40px_-10px_rgba(232,163,61,0.5)]'
      )}
    >
      <Link href={detailsHref} className="relative block aspect-video overflow-hidden">
        <Image
          src={photo}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {past && (
          <span className="absolute left-2 top-2 bg-ink/70 px-2 py-1 font-sans text-xs uppercase tracking-widest text-cream">
            Past Event
          </span>
        )}
      </Link>
      <div className="p-6">
        {event.category && (
          <p
            className={cn(
              'font-sans text-xs uppercase tracking-widest',
              dark ? 'text-gold' : 'text-gold-deep'
            )}
          >
            {event.category}
          </p>
        )}
        <Link href={detailsHref}>
          <h3
            className={cn(
              'mt-1 line-clamp-2 font-display text-h4 font-semibold',
              dark ? 'text-cream' : 'text-ink'
            )}
          >
            {event.title}
          </h3>
        </Link>
        <p
          className={cn(
            'mt-2 font-sans text-xs uppercase tracking-widest',
            dark ? 'text-cream/70' : 'text-ink/70'
          )}
        >
          {formatEventDateTimeRange(event.start_time, event.end_time)}
        </p>
        {branchName && (
          <p className={cn('mt-1 text-sm', dark ? 'text-cream/70' : 'text-ink/70')}>{branchName}</p>
        )}
        {event.description && (
          <p className={cn('mt-3 line-clamp-1 text-sm', dark ? 'text-cream/70' : 'text-ink/70')}>
            {event.description}
          </p>
        )}
        <div className="mt-6">
          {isExternalRegister ? (
            <a
              href={event.register_url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'font-sans text-sm font-semibold uppercase tracking-widest transition-colors',
                dark ? 'text-gold hover:text-gold-light' : 'text-navy-elevated hover:text-gold-deep'
              )}
            >
              Register →
            </a>
          ) : (
            <Link
              href={detailsHref}
              className={cn(
                'font-sans text-sm font-semibold uppercase tracking-widest transition-colors',
                dark ? 'text-gold hover:text-gold-light' : 'text-navy-elevated hover:text-gold-deep'
              )}
            >
              Details →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
