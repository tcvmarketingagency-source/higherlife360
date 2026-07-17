'use client';

import { useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils';
import { findNearest } from '@/lib/geo';
import { BranchesMapLoader } from './BranchesMapLoader';
import { BranchCard } from './BranchCard';
import type { BranchRow } from '@/lib/database.types';

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

type GeoStatus = 'idle' | 'locating' | 'done' | 'denied' | 'unsupported';

export function BranchesExplorer({ branches }: { branches: BranchRow[] }) {
  const [query, setQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [flyToTarget, setFlyToTarget] = useState<[number, number] | null>(null);
  const [nearestId, setNearestId] = useState<string | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');

  const countryOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(branches.map((b) => b.country).filter((v): v is string => Boolean(v)))
      ).sort(),
    ],
    [branches]
  );

  const filteredBranches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return branches.filter((branch) => {
      const matchesQuery =
        !q ||
        (branch.city ?? '').toLowerCase().includes(q) ||
        (branch.country ?? '').toLowerCase().includes(q) ||
        branch.name.toLowerCase().includes(q);
      const matchesCountry = countryFilter === 'All' || branch.country === countryFilter;
      return matchesQuery && matchesCountry;
    });
  }, [branches, query, countryFilter]);

  // Scroll to the nearest branch's card once the grid has re-rendered with
  // filters cleared (so the card is guaranteed to actually be in the DOM).
  useEffect(() => {
    if (!nearestId) return;
    const frame = requestAnimationFrame(() => {
      document
        .getElementById(`branch-${nearestId}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    return () => cancelAnimationFrame(frame);
  }, [nearestId, filteredBranches]);

  function handleFindNearest() {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoStatus('unsupported');
      return;
    }

    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearest = findNearest(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          branches
        );
        if (nearest && nearest.lat != null && nearest.lng != null) {
          setFlyToTarget([nearest.lat, nearest.lng]);
          setNearestId(nearest.id);
          setCountryFilter('All');
          setQuery('');
        }
        setGeoStatus('done');
      },
      () => setGeoStatus('denied'), // permission denied — fail quietly, no disruptive error
      { timeout: 10000 }
    );
  }

  if (branches.length === 0) {
    return (
      <Container className="py-24 text-center">
        <p className="font-display text-h3 font-semibold text-ink">
          Branch information is coming soon.
        </p>
        <p className="mt-3 text-body text-ink/70">Check back shortly as we grow.</p>
      </Container>
    );
  }

  return (
    <>
      {/* Search + Find Nearest — visually continues the hero above */}
      <div className="border-b border-gold/10 bg-crimson-deep/95 pb-10 pt-2">
        <Container>
          <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by city or country…"
              aria-label="Search branches"
              className="w-full border border-gold/30 bg-transparent px-5 py-3 font-sans text-sm text-cream placeholder:text-cream/70 focus:border-gold focus:outline-none"
            />
            <button
              type="button"
              onClick={handleFindNearest}
              disabled={geoStatus === 'locating'}
              className="whitespace-nowrap border border-gold px-6 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-crimson-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {geoStatus === 'locating' ? 'Locating…' : 'Find Nearest Branch'}
            </button>
          </div>
          {geoStatus === 'denied' && (
            <p className="mx-auto mt-3 max-w-xl text-center text-xs text-cream/70">
              Location access wasn&apos;t granted — browse the map or search by city instead.
            </p>
          )}
          {geoStatus === 'unsupported' && (
            <p className="mx-auto mt-3 max-w-xl text-center text-xs text-cream/70">
              Your browser doesn&apos;t support location search — try the map or search instead.
            </p>
          )}
        </Container>
      </div>

      {/* Map */}
      <Section tone="cream">
        <Container>
          <div className="h-[420px] w-full overflow-hidden border border-gold/30 sm:h-[480px]">
            <BranchesMapLoader branches={branches} flyToTarget={flyToTarget} />
          </div>
        </Container>
      </Section>

      {/* Country filter + directory grid */}
      <Section tone="cream" className="pt-0">
        <Container>
          <div className="flex flex-wrap justify-center gap-2 border-t border-ink/10 pt-10">
            {countryOptions.map((country) => (
              <FilterPill
                key={country}
                label={country}
                active={countryFilter === country}
                onClick={() => setCountryFilter(country)}
              />
            ))}
          </div>

          {filteredBranches.length > 0 ? (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBranches.map((branch) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  id={`branch-${branch.id}`}
                  highlighted={branch.id === nearestId}
                />
              ))}
            </div>
          ) : (
            <p className="mt-14 text-center font-sans text-body text-ink/70">
              No branches match your search.
            </p>
          )}
        </Container>
      </Section>
    </>
  );
}
