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

export function EventListRow({
  event,
  branchName,
}: {
  event: EventRow;
  branchName?: string | null;
}) {
  const photo = event.image_url ?? fallbackPhoto(event.id);
  const past = isPastEvent(event);
  const detailsHref = `/events/${event.id}`;

  return (
    <div
      className={cn(
        'flex items-center gap-4 border-b border-ink/10 py-4 transition-colors sm:gap-6',
        past ? 'opacity-60' : 'hover:bg-ink/[0.02]'
      )}
    >
      <Link
        href={detailsHref}
        className="relative h-16 w-24 flex-shrink-0 overflow-hidden sm:h-20 sm:w-32"
      >
        <Image src={photo} alt={event.title} fill sizes="128px" className="object-cover" />
      </Link>
      <div className="min-w-0 flex-1">
        {event.category && (
          <p className="font-sans text-xs uppercase tracking-widest text-gold-deep">
            {event.category}
          </p>
        )}
        <Link href={detailsHref}>
          <p className="truncate font-display text-h4 font-semibold text-ink">{event.title}</p>
        </Link>
        <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
          {formatEventDateTimeRange(event.start_time, event.end_time)}
          {branchName ? ` · ${branchName}` : ''}
        </p>
      </div>
      {event.register_url ? (
        <a
          href={event.register_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 font-sans text-xs font-semibold uppercase tracking-widest text-navy-elevated transition-colors hover:text-gold-deep"
        >
          Register
        </a>
      ) : (
        <Link
          href={detailsHref}
          className="flex-shrink-0 font-sans text-xs font-semibold uppercase tracking-widest text-navy-elevated transition-colors hover:text-gold-deep"
        >
          Details
        </Link>
      )}
    </div>
  );
}
