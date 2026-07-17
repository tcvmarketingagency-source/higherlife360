import Image from 'next/image';
import { EVENT_PHOTO_PLACEHOLDERS } from '@/lib/unsplash-placeholders';
import type { EventRow } from '@/lib/database.types';

function fallbackPhoto(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return EVENT_PHOTO_PLACEHOLDERS[hash % EVENT_PHOTO_PLACEHOLDERS.length];
}

export function PastEventsGallery({ events }: { events: EventRow[] }) {
  if (events.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {events.slice(0, 8).map((event) => (
        <div key={event.id} className="group relative aspect-square overflow-hidden">
          <Image
            src={event.image_url ?? fallbackPhoto(event.id)}
            alt={event.title}
            fill
            sizes="(min-width: 768px) 220px, 45vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="font-sans text-xs font-medium text-cream">{event.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
