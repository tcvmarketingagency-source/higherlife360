import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { BRANCH_PHOTO_PLACEHOLDERS } from '@/lib/unsplash-placeholders';
import type { BranchRow } from '@/lib/database.types';

function directionsUrl(branch: BranchRow): string | null {
  if (branch.lat != null && branch.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`;
  }
  const query = [branch.address, branch.city, branch.country].filter(Boolean).join(', ');
  return query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : null;
}

// Deterministic placeholder photo per branch (stable across renders) for
// branches that don't have a real `photo_url` yet.
function fallbackPhoto(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return BRANCH_PHOTO_PLACEHOLDERS[hash % BRANCH_PHOTO_PLACEHOLDERS.length];
}

export function BranchCard({
  branch,
  id,
  highlighted = false,
}: {
  branch: BranchRow;
  id?: string;
  highlighted?: boolean;
}) {
  const photo = branch.photo_url ?? fallbackPhoto(branch.id);
  const directions = directionsUrl(branch);

  return (
    <div
      id={id}
      className={cn(
        'group overflow-hidden border border-gold/20 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_40px_-10px_rgba(232,163,61,0.5)]',
        highlighted && 'ring-2 ring-gold ring-offset-4 ring-offset-cream'
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={photo}
          alt={branch.name}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display text-h4 font-semibold text-ink">{branch.name}</h3>
        <p className="mt-1 font-sans text-xs uppercase tracking-widest text-ink/70">
          {[branch.city, branch.country].filter(Boolean).join(', ')}
        </p>
        {branch.service_times && (
          <p className="mt-3 font-sans text-xs uppercase tracking-widest text-gold-deep">
            {branch.service_times}
          </p>
        )}
        {branch.pastor_name && (
          <p className="mt-2 text-sm text-ink/70">Pastor {branch.pastor_name}</p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {directions && (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-semibold uppercase tracking-widest text-navy-elevated transition-colors hover:text-gold-deep"
            >
              Get Directions
            </a>
          )}
          <Button href={`/branches/${branch.id}`} variant="outline">
            Plan Your Visit
          </Button>
        </div>
      </div>
    </div>
  );
}
