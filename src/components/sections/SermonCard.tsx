import { Button } from '@/components/ui/Button';
import type { SermonRow } from '@/lib/database.types';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SermonCard({ sermon }: { sermon: SermonRow }) {
  const meta = [sermon.speaker, formatDate(sermon.published_at)].filter(Boolean).join(' · ');

  return (
    <div className="overflow-hidden border border-gold/30 bg-white">
      <div
        className="relative flex aspect-video items-center justify-center"
        style={{
          background: sermon.thumbnail_url
            ? `center / cover no-repeat url(${sermon.thumbnail_url})`
            : 'linear-gradient(135deg, #5C0A18 0%, #7A0C1F 100%)',
        }}
      >
        <span
          aria-hidden
          className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-2xl text-gold"
        >
          &#9658;
        </span>
      </div>
      <div className="p-6">
        {sermon.series && (
          <p className="font-sans text-xs uppercase tracking-widest text-gold">{sermon.series}</p>
        )}
        <h3 className="mt-2 font-display text-h4 font-semibold text-ink">{sermon.title}</h3>
        {meta && (
          <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink/70">{meta}</p>
        )}
        {sermon.scripture && (
          <p className="mt-2 font-sans text-xs text-ink/70">{sermon.scripture}</p>
        )}
        <div className="mt-6 flex items-center gap-4">
          {sermon.video_url ? (
            <Button
              href={sermon.video_url}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch Now
            </Button>
          ) : (
            <span className="font-sans text-xs uppercase tracking-widest text-ink/70">
              Coming Soon
            </span>
          )}
          {sermon.duration && (
            <span className="font-sans text-xs text-ink/70">{sermon.duration}</span>
          )}
        </div>
      </div>
    </div>
  );
}
