'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { SermonGridCard } from './SermonGridCard';
import { SeriesRow } from './SeriesRow';
import type { SermonRow } from '@/lib/database.types';

const PAGE_SIZE = 6;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  if (options.length <= 1) return null;

  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-widest text-ink/70">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            onClick={() => onChange(option)}
            className={cn(
              'px-4 py-1.5 font-sans text-xs uppercase tracking-widest transition-colors',
              value === option
                ? 'bg-gold text-crimson-deep'
                : 'border border-ink/20 text-ink/70 hover:border-gold hover:text-ink'
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SermonLibrary({ sermons }: { sermons: SermonRow[] }) {
  const [query, setQuery] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('All');
  const [speakerFilter, setSpeakerFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, seriesFilter, speakerFilter, topicFilter, sortOrder]);

  const seriesOptions = useMemo(
    () => [
      'All',
      ...Array.from(new Set(sermons.map((s) => s.series).filter((v): v is string => Boolean(v)))),
    ],
    [sermons]
  );
  const speakerOptions = useMemo(
    () => [
      'All',
      ...Array.from(new Set(sermons.map((s) => s.speaker).filter((v): v is string => Boolean(v)))),
    ],
    [sermons]
  );
  // Topic filtering is derived from the `scripture` column since the sermons
  // table has no dedicated topic/tags field.
  const topicOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(sermons.map((s) => s.scripture).filter((v): v is string => Boolean(v)))
      ),
    ],
    [sermons]
  );

  const filteredSermons = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = sermons.filter((sermon) => {
      const matchesQuery =
        !q ||
        sermon.title.toLowerCase().includes(q) ||
        (sermon.speaker ?? '').toLowerCase().includes(q) ||
        (sermon.scripture ?? '').toLowerCase().includes(q) ||
        (sermon.series ?? '').toLowerCase().includes(q);
      const matchesSeries = seriesFilter === 'All' || sermon.series === seriesFilter;
      const matchesSpeaker = speakerFilter === 'All' || sermon.speaker === speakerFilter;
      const matchesTopic = topicFilter === 'All' || sermon.scripture === topicFilter;
      return matchesQuery && matchesSeries && matchesSpeaker && matchesTopic;
    });

    return [...result].sort((a, b) => {
      const diff = new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      return sortOrder === 'newest' ? diff : -diff;
    });
  }, [sermons, query, seriesFilter, speakerFilter, topicFilter, sortOrder]);

  const seriesGroups = useMemo(() => {
    const map = new Map<string, SermonRow[]>();
    sermons.forEach((sermon) => {
      if (!sermon.series) return;
      const list = map.get(sermon.series) ?? [];
      list.push(sermon);
      map.set(sermon.series, list);
    });
    return Array.from(map.entries());
  }, [sermons]);

  if (sermons.length === 0) {
    return (
      <Container className="py-24 text-center">
        <p className="font-display text-h3 font-semibold text-ink">New messages coming soon.</p>
        <p className="mt-3 text-body text-ink/70">Check back after this Sunday.</p>
      </Container>
    );
  }

  const featured = sermons[0];
  const visibleSermons = filteredSermons.slice(0, visibleCount);
  const hasMore = visibleCount < filteredSermons.length;

  return (
    <>
      {/* Search — visually continues the hero band above */}
      <div className="border-b border-gold/10 bg-crimson-deep pb-10 pt-2">
        <Container>
          <div className="mx-auto max-w-xl">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, speaker, or scripture…"
              aria-label="Search messages"
              className="w-full border border-gold/30 bg-transparent px-5 py-3 font-sans text-sm text-cream placeholder:text-cream/70 focus:border-gold focus:outline-none"
            />
          </div>
        </Container>
      </div>

      {/* Featured message */}
      <Section tone="cream">
        <Container>
          <Link
            href={`/recording/${featured.id}`}
            className="group grid overflow-hidden border border-gold/30 bg-white transition-colors hover:border-gold md:grid-cols-2"
          >
            <div className="relative aspect-video md:aspect-auto">
              {featured.thumbnail_url ? (
                <Image
                  src={featured.thumbnail_url}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{ background: 'linear-gradient(135deg, #5C0A18 0%, #7A0C1F 100%)' }}
                />
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold text-2xl text-gold">
                  &#9658;
                </span>
              </span>
            </div>
            <div className="p-6 md:p-10">
              <p className="text-eyebrow font-semibold uppercase text-gold">Latest Message</p>
              {featured.series && (
                <p className="mt-2 font-sans text-xs uppercase tracking-widest text-crimson">
                  {featured.series}
                </p>
              )}
              <h2 className="mt-2 font-display text-h2 font-semibold text-ink">{featured.title}</h2>
              <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink/70">
                {[featured.speaker, formatDate(featured.published_at)].filter(Boolean).join(' · ')}
              </p>
              {featured.scripture && (
                <p className="mt-2 text-sm text-ink/70">{featured.scripture}</p>
              )}
              {featured.description && (
                <p className="mt-4 line-clamp-3 text-body text-ink/80">{featured.description}</p>
              )}
              <div className="mt-6">
                <span className="inline-flex items-center justify-center bg-gold px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-crimson-deep transition-colors group-hover:bg-gold-light">
                  Watch Now
                </span>
              </div>
            </div>
          </Link>
        </Container>
      </Section>

      {/* Filters */}
      <Section tone="cream" className="pt-0">
        <Container>
          <div className="flex flex-col gap-6 border-t border-ink/10 pt-10">
            <FilterGroup
              label="Series"
              options={seriesOptions}
              value={seriesFilter}
              onChange={setSeriesFilter}
            />
            <FilterGroup
              label="Speaker"
              options={speakerOptions}
              value={speakerFilter}
              onChange={setSpeakerFilter}
            />
            <FilterGroup
              label="Topic"
              options={topicOptions}
              value={topicFilter}
              onChange={setTopicFilter}
            />
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs uppercase tracking-widest text-ink/70">Sort</span>
              {(['newest', 'oldest'] as const).map((order) => (
                <button
                  key={order}
                  type="button"
                  aria-pressed={sortOrder === order}
                  onClick={() => setSortOrder(order)}
                  className={cn(
                    'px-4 py-1.5 font-sans text-xs uppercase tracking-widest transition-colors',
                    sortOrder === order
                      ? 'bg-crimson text-cream'
                      : 'border border-ink/20 text-ink/70 hover:border-gold hover:text-ink'
                  )}
                >
                  {order === 'newest' ? 'Newest' : 'Oldest'}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Series collections (Netflix-style rows) */}
      {seriesGroups.length > 0 && (
        <Section tone="crimson-deep">
          <Container>
            <div className="flex flex-col gap-12">
              {seriesGroups.map(([seriesName, seriesSermons]) => (
                <SeriesRow key={seriesName} title={seriesName} sermons={seriesSermons} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* All messages grid */}
      <Section tone="cream">
        <Container>
          <SectionTitle eyebrow="Browse" title="All Messages" />
          {visibleSermons.length > 0 ? (
            <>
              <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleSermons.map((sermon) => (
                  <SermonGridCard key={sermon.id} sermon={sermon} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-10 text-center">
                  <Button
                    variant="outline"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  >
                    Load More
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="mt-14 text-center font-sans text-body text-ink/70">
              No messages match your search.
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}
