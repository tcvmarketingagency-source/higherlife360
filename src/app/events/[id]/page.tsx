import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import nextDynamic from 'next/dynamic';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { ShareButton } from '@/components/sections/ShareButton';
import { AddToCalendarButtons } from '@/components/sections/AddToCalendarButtons';
import { RsvpForm } from '@/components/sections/RsvpForm';
import { EventCard } from '@/components/sections/EventCard';
import { supabase } from '@/lib/supabase';
import { EVENT_PHOTO_PLACEHOLDERS } from '@/lib/unsplash-placeholders';
import {
  formatEventDate,
  formatEventTime,
  formatEventDuration,
  isPastEvent,
} from '@/lib/event-time';

const BranchesMapLoader = nextDynamic(() =>
  import('@/components/sections/BranchesMapLoader').then((mod) => mod.BranchesMapLoader)
);

export const dynamic = 'force-dynamic';

const getEvent = cache(async (id: string) => {
  const { data } = await supabase.from('events').select('*').eq('id', id).maybeSingle();
  return data;
});

function fallbackPhoto(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return EVENT_PHOTO_PLACEHOLDERS[hash % EVENT_PHOTO_PLACEHOLDERS.length];
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const event = await getEvent(params.id);
  if (!event) {
    return { title: 'Event Not Found' };
  }
  const description = event.description ?? `Join us for ${event.title} at HigherLife360.`;
  const image = event.image_url ?? fallbackPhoto(event.id);
  return {
    title: event.title,
    description,
    openGraph: {
      title: `${event.title} | HigherLife360`,
      description,
      images: [{ url: image }],
      type: 'website',
    },
  };
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);
  if (!event) notFound();

  const branch = event.branch_id
    ? (await supabase.from('branches').select('*').eq('id', event.branch_id).maybeSingle()).data
    : null;

  const { data: moreEventsRaw } = await supabase
    .from('events')
    .select('*')
    .neq('id', event.id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(3);
  const moreEvents = moreEventsRaw ?? [];

  const photo = event.image_url ?? fallbackPhoto(event.id);
  const past = isPastEvent(event);
  const duration = formatEventDuration(event.start_time, event.end_time);
  const location = branch
    ? [branch.name, branch.city, branch.country].filter(Boolean).join(', ')
    : null;

  // Event structured data (JSON-LD) — helps Google show rich event results.
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.start_time,
    endDate: event.end_time ?? undefined,
    description: event.description ?? undefined,
    image: [photo],
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: branch
      ? {
          '@type': 'Place',
          name: branch.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: branch.address ?? undefined,
            addressLocality: branch.city ?? undefined,
            addressCountry: branch.country ?? undefined,
          },
        }
      : undefined,
    organizer: {
      '@type': 'Organization',
      name: 'HigherLife360',
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      {/* Cinematic header */}
      <section className="relative flex h-[50vh] min-h-[360px] items-end overflow-hidden bg-crimson-deep">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${photo})` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-crimson-deep via-crimson-deep/60 to-crimson-deep/20"
        />
        <Container className="relative pb-10">
          {event.category && (
            <p className="text-eyebrow font-semibold uppercase text-gold">{event.category}</p>
          )}
          <h1 className="mt-3 font-display text-h1 font-semibold text-cream">{event.title}</h1>
          {past && (
            <p className="mt-3 font-sans text-xs uppercase tracking-widest text-cream/60">
              Past Event
            </p>
          )}
        </Container>
      </section>

      {/* Full details */}
      <Section tone="cream">
        <Container>
          <div className="mx-auto max-w-3xl">
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="font-sans text-xs uppercase tracking-widest text-ink/70">Date</dt>
                <dd className="mt-1 text-body text-ink/80">{formatEventDate(event.start_time)}</dd>
              </div>
              <div>
                <dt className="font-sans text-xs uppercase tracking-widest text-ink/70">Time</dt>
                <dd className="mt-1 text-body text-ink/80">
                  {formatEventTime(event.start_time)}
                  {duration ? ` · ${duration}` : ''}
                </dd>
              </div>
              {location && (
                <div>
                  <dt className="font-sans text-xs uppercase tracking-widest text-ink/70">
                    Location
                  </dt>
                  <dd className="mt-1 text-body text-ink/80">
                    {branch ? (
                      <Link
                        href={`/branches/${branch.id}`}
                        className="hover:text-gold hover:underline"
                      >
                        {location}
                      </Link>
                    ) : (
                      location
                    )}
                  </dd>
                </div>
              )}
              {event.category && (
                <div>
                  <dt className="font-sans text-xs uppercase tracking-widest text-ink/70">
                    Category
                  </dt>
                  <dd className="mt-1 text-body text-ink/80">{event.category}</dd>
                </div>
              )}
            </dl>

            {event.description && <p className="mt-8 text-body text-ink/80">{event.description}</p>}

            {!past && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {event.register_url ? (
                  <Button
                    href={event.register_url}
                    variant="primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register Now
                  </Button>
                ) : (
                  <Button href="#rsvp" variant="primary">
                    Register Now
                  </Button>
                )}
                <ShareButton title={event.title} />
              </div>
            )}

            <div className="mt-6">
              <AddToCalendarButtons
                id={event.id}
                title={event.title}
                description={event.description}
                location={location}
                startTime={event.start_time}
                endTime={event.end_time}
              />
            </div>

            {branch && branch.lat != null && branch.lng != null && (
              <div className="mt-10 h-[280px] w-full overflow-hidden border border-gold/30">
                <BranchesMapLoader
                  branches={[branch]}
                  center={[branch.lat, branch.lng]}
                  zoom={13}
                />
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* RSVP fallback — only when there's no external registration link */}
      {!past && !event.register_url && (
        <Section tone="crimson-deep" id="rsvp">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-eyebrow font-semibold uppercase text-gold">Save Your Spot</p>
              <h2 className="mt-3 font-display text-h2 font-semibold text-cream">RSVP</h2>
            </div>
            <div className="mx-auto mt-10 max-w-2xl">
              <RsvpForm eventId={event.id} />
            </div>
          </Container>
        </Section>
      )}

      {/* More events */}
      {moreEvents.length > 0 && (
        <Section tone="cream">
          <Container>
            <h2 className="font-display text-h3 font-semibold text-ink">More Events</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {moreEvents.map((otherEvent) => (
                <EventCard key={otherEvent.id} event={otherEvent} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </main>
  );
}
