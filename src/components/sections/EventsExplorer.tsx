'use client';

import { useMemo, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { cn } from '@/lib/utils';
import { isPastEvent } from '@/lib/event-time';
import { EventCard } from './EventCard';
import { EventListRow } from './EventListRow';
import type { EventRow, BranchRow } from '@/lib/database.types';

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'px-4 py-1.5 font-sans text-xs uppercase tracking-widest transition-colors',
        active
          ? 'bg-gold text-crimson-deep'
          : 'border border-ink/20 text-ink/70 hover:border-gold hover:text-ink'
      )}
    >
      {label}
    </button>
  );
}

export function EventsExplorer({
  events,
  branches,
}: {
  events: EventRow[];
  branches: BranchRow[];
}) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const branchNameById = useMemo(
    () => new Map(branches.map((branch) => [branch.id, branch.name])),
    [branches]
  );

  const categoryOptions = useMemo(
    () => [
      'All',
      ...Array.from(new Set(events.map((e) => e.category).filter((v): v is string => Boolean(v)))),
    ],
    [events]
  );

  const branchOptions = useMemo(() => {
    const names = new Set<string>();
    events.forEach((event) => {
      if (event.branch_id) {
        const name = branchNameById.get(event.branch_id);
        if (name) names.add(name);
      }
    });
    return ['All', ...Array.from(names).sort()];
  }, [events, branchNameById]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
        const branchName = event.branch_id ? branchNameById.get(event.branch_id) : null;
        const matchesBranch = branchFilter === 'All' || branchName === branchFilter;
        return matchesCategory && matchesBranch;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [events, categoryFilter, branchFilter, branchNameById]);

  const upcomingEvents = filteredEvents.filter((event) => !isPastEvent(event));
  const pastEvents = filteredEvents
    .filter((event) => isPastEvent(event))
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  if (events.length === 0) {
    return (
      <Container className="py-24 text-center">
        <p className="font-display text-h3 font-semibold text-ink">
          No events scheduled right now — but something&rsquo;s always coming.
        </p>
        <p className="mt-3 text-body text-ink/70">Check back soon.</p>
      </Container>
    );
  }

  return (
    <Section tone="cream">
      <Container>
        <SectionTitle eyebrow="Browse" title="All Events" />

        <div className="mt-14 flex flex-col gap-6 border-t border-ink/10 pt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-ink/70">Category</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categoryOptions.map((category) => (
                    <FilterPill
                      key={category}
                      label={category}
                      active={categoryFilter === category}
                      onClick={() => setCategoryFilter(category)}
                    />
                  ))}
                </div>
              </div>
              {branchOptions.length > 1 && (
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-ink/70">Branch</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {branchOptions.map((branch) => (
                      <FilterPill
                        key={branch}
                        label={branch}
                        active={branchFilter === branch}
                        onClick={() => setBranchFilter(branch)}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-ink/70">Show</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <FilterPill
                    label="Upcoming Only"
                    active={upcomingOnly}
                    onClick={() => setUpcomingOnly(true)}
                  />
                  <FilterPill
                    label="All"
                    active={!upcomingOnly}
                    onClick={() => setUpcomingOnly(false)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-shrink-0 gap-2">
              {(['grid', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={viewMode === mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    'px-4 py-1.5 font-sans text-xs uppercase tracking-widest transition-colors',
                    viewMode === mode
                      ? 'bg-crimson text-cream'
                      : 'border border-ink/20 text-ink/70 hover:border-gold hover:text-ink'
                  )}
                >
                  {mode === 'grid' ? 'Grid' : 'List'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {upcomingEvents.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  branchName={event.branch_id ? branchNameById.get(event.branch_id) : null}
                />
              ))}
            </div>
          ) : (
            <div className="mt-10 border-t border-ink/10">
              {upcomingEvents.map((event) => (
                <EventListRow
                  key={event.id}
                  event={event}
                  branchName={event.branch_id ? branchNameById.get(event.branch_id) : null}
                />
              ))}
            </div>
          )
        ) : (
          <p className="mt-10 text-center font-sans text-body text-ink/70">
            No upcoming events match your filters.
          </p>
        )}

        {!upcomingOnly && pastEvents.length > 0 && (
          <div className="mt-20">
            <h3 className="font-display text-h3 font-semibold text-ink">Past Events</h3>
            {viewMode === 'grid' ? (
              <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    branchName={event.branch_id ? branchNameById.get(event.branch_id) : null}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 border-t border-ink/10">
                {pastEvents.map((event) => (
                  <EventListRow
                    key={event.id}
                    event={event}
                    branchName={event.branch_id ? branchNameById.get(event.branch_id) : null}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
