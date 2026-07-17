import { SermonGridCard } from './SermonGridCard';
import type { SermonRow } from '@/lib/database.types';

export function SeriesRow({ title, sermons }: { title: string; sermons: SermonRow[] }) {
  if (sermons.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-h4 font-semibold text-cream">{title}</h3>
      <div className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sermons.map((sermon) => (
          <SermonGridCard
            key={sermon.id}
            sermon={sermon}
            className="w-64 flex-shrink-0 snap-start sm:w-72"
          />
        ))}
      </div>
    </div>
  );
}
