import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { EventsExplorer } from '@/components/sections/EventsExplorer';
import { PastEventsGallery } from '@/components/sections/PastEventsGallery';
import { supabase } from '@/lib/supabase';
import { isPastEvent, formatEventDateTimeRange } from '@/lib/event-time';
import {
  EVENT_PHOTO_PLACEHOLDERS,
  UNSPLASH_EVENTS_HERO_BACKGROUND,
} from '@/lib/unsplash-placeholders';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Conferences, worship nights, and gatherings across the HigherLife family. Find your next moment.',
  openGraph: {
    title: 'Events | HigherLife360',
    description:
      'Conferences, worship nights, and gatherings across the HigherLife family. Find your next moment.',
    images: [{ url: UNSPLASH_EVENTS_HERO_BACKGROUND }],
  },
};

function fallbackPhoto(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return EVENT_PHOTO_PLACEHOLDERS[hash % EVENT_PHOTO_PLACEHOLDERS.length];
}

export default async function EventsPage() {
  const [{ data: eventsData }, { data: branchesData }] = await Promise.all([
    supabase.from('events').select('*').order('start_time', { ascending: true }),
    supabase.from('branches').select('*'),
  ]);

  const events = eventsData ?? [];
  const branches = branchesData ?? [];
  const branchNameById = new Map(branches.map((branch) => [branch.id, branch.name]));

  const upcoming = events.filter((event) => !isPastEvent(event));
  const featured = upcoming[0] ?? null;
  const pastEvents = events
    .filter((event) => isPastEvent(event))
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  return (
    <main>
      <section className="relative overflow-hidden bg-navy pb-16 pt-40 text-center">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 event
            photo. Verified free (non-Unsplash+) at time of writing. See
            src/lib/unsplash-placeholders.ts for the source. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${UNSPLASH_EVENTS_HERO_BACKGROUND})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-navy/90" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 20%, rgba(242,184,94,0.14), transparent 55%)',
          }}
        />
        <Container className="relative">
          <p className="text-eyebrow font-semibold uppercase text-accent [text-shadow:0_1px_10px_rgb(0_0_0_/_60%)]">
            Events
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-h1 font-semibold text-cream">
            What&rsquo;s Happening
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-cream/75">
            Conferences, worship nights, and gatherings across the HigherLife family. Find your next
            moment.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-body text-cream/70">
            Life happens in the room, not just on the calendar. From conferences that stretch your
            faith to worship nights that reset your soul, to outreach days that put your hands to
            work in your own city — every gathering here is a chance to belong a little more deeply.
            Filter below, or just scroll and see what catches your heart.
          </p>
        </Container>
      </section>

      {featured && (
        <section className="bg-cream py-20">
          <Container>
            <div className="grid overflow-hidden border border-gold/30 bg-white md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto">
                <Image
                  src={featured.image_url ?? fallbackPhoto(featured.id)}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-10">
                <p className="text-eyebrow font-semibold uppercase text-gold-deep">Up Next</p>
                {featured.category && (
                  <p className="mt-2 font-sans text-xs uppercase tracking-widest text-navy-elevated">
                    {featured.category}
                  </p>
                )}
                <h2 className="mt-2 font-display text-h2 font-semibold text-ink">
                  {featured.title}
                </h2>
                <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink/70">
                  {formatEventDateTimeRange(featured.start_time, featured.end_time)}
                </p>
                {featured.branch_id && branchNameById.get(featured.branch_id) && (
                  <p className="mt-1 text-sm text-ink/70">
                    {branchNameById.get(featured.branch_id)}
                  </p>
                )}
                {featured.description && (
                  <p className="mt-4 line-clamp-3 text-body text-ink/80">{featured.description}</p>
                )}
                <div className="mt-6">
                  {featured.register_url ? (
                    <Button
                      href={featured.register_url}
                      variant="primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Register
                    </Button>
                  ) : (
                    <Button href={`/events/${featured.id}`} variant="primary">
                      Register
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      <EventsExplorer events={events} branches={branches} />

      {pastEvents.length > 0 && (
        <section className="bg-navy py-20">
          <Container>
            <p className="text-center text-eyebrow font-semibold uppercase text-accent">
              Looking Back
            </p>
            <h2 className="mt-3 text-center font-display text-h2 font-semibold text-cream">
              Past Events
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-cream/70">
              A few highlights from gatherings past.
            </p>
            <div className="mt-12">
              <PastEventsGallery events={pastEvents} />
            </div>
          </Container>
        </section>
      )}

      <section className="bg-gold py-14 text-center">
        <Container>
          <p className="font-display text-h3 font-semibold text-navy">
            Don&apos;t miss what&apos;s next.
          </p>
          <p className="mt-2 text-navy">
            Check{' '}
            <Link href="/branches" className="font-semibold underline-offset-4 hover:underline">
              your branch
            </Link>{' '}
            for local gatherings too.
          </p>
        </Container>
      </section>
    </main>
  );
}
