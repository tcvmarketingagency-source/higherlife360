import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { SermonRow } from '@/lib/database.types';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SermonGridCard({ sermon, className }: { sermon: SermonRow; className?: string }) {
  return (
    <Link
      href={`/recording/${sermon.id}`}
      className={cn(
        'group block overflow-hidden border border-gold/20 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_40px_-10px_rgba(201,162,75,0.5)]',
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-crimson-deep">
        {sermon.thumbnail_url ? (
          <Image
            src={sermon.thumbnail_url}
            alt={sermon.title}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: 'linear-gradient(135deg, #5C0A18 0%, #7A0C1F 100%)' }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/30">
          <span
            aria-hidden
            className="flex h-12 w-12 scale-90 items-center justify-center rounded-full border border-gold text-lg text-gold opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
          >
            &#9658;
          </span>
        </div>
        {sermon.duration && (
          <span className="absolute bottom-2 right-2 bg-ink/70 px-2 py-1 font-sans text-xs text-cream">
            {sermon.duration}
          </span>
        )}
      </div>
      <div className="p-4">
        {sermon.series && (
          <p className="font-sans text-xs uppercase tracking-widest text-gold">{sermon.series}</p>
        )}
        <h3 className="mt-1 line-clamp-2 font-display text-h4 font-semibold text-ink">
          {sermon.title}
        </h3>
        <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
          {[sermon.speaker, formatDate(sermon.published_at)].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  );
}
