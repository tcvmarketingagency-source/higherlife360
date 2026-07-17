import type { Metadata } from 'next';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import nextDynamic from 'next/dynamic';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { BRANCH_PHOTO_PLACEHOLDERS } from '@/lib/unsplash-placeholders';

const BranchesMapLoader = nextDynamic(() =>
  import('@/components/sections/BranchesMapLoader').then((mod) => mod.BranchesMapLoader)
);

export const dynamic = 'force-dynamic';

const getBranch = cache(async (id: string) => {
  const { data } = await supabase.from('branches').select('*').eq('id', id).maybeSingle();
  return data;
});

function fallbackPhoto(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return BRANCH_PHOTO_PLACEHOLDERS[hash % BRANCH_PHOTO_PLACEHOLDERS.length];
}

function directionsUrl(branch: {
  lat: number | null;
  lng: number | null;
  address: string | null;
  city: string | null;
  country: string | null;
  name: string;
}): string | null {
  if (branch.lat != null && branch.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`;
  }
  const query = [branch.address, branch.city, branch.country].filter(Boolean).join(', ');
  return query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const branch = await getBranch(params.id);
  if (!branch) {
    return { title: 'Branch Not Found' };
  }
  const location = [branch.city, branch.country].filter(Boolean).join(', ');
  const title = `${branch.name}${location ? ` — ${location}` : ''}`;
  const description = `Service times, address, and directions for ${branch.name}${location ? ` in ${location}` : ''}.`;
  const image = branch.photo_url ?? fallbackPhoto(branch.id);
  return {
    title,
    description,
    openGraph: {
      title: `${title} | HigherLife360`,
      description,
      images: [{ url: image }],
    },
  };
}

export default async function BranchDetailPage({ params }: { params: { id: string } }) {
  const branch = await getBranch(params.id);
  if (!branch) notFound();

  const { data: upcomingEvents } = await supabase
    .from('events')
    .select('*')
    .eq('branch_id', branch.id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(4);

  const photo = branch.photo_url ?? fallbackPhoto(branch.id);
  const directions = directionsUrl(branch);

  return (
    <main>
      {/* Cinematic header */}
      <section className="relative flex h-[50vh] min-h-[360px] items-end overflow-hidden bg-crimson-deep">
        {/* TEMPORARY STOCK PHOTO fallback when this branch has no real
            photo_url yet — replace with the real branch photo in Supabase. */}
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
          {branch.country && (
            <p className="text-eyebrow font-semibold uppercase text-gold">{branch.country}</p>
          )}
          <h1 className="mt-3 font-display text-h1 font-semibold text-cream">{branch.name}</h1>
          {branch.city && <p className="mt-2 text-body-lg text-cream/75">{branch.city}</p>}
        </Container>
      </section>

      {/* Full info + map */}
      <Section tone="cream">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-h3 font-semibold text-ink">Visit Us</h2>
              <dl className="mt-6 space-y-4">
                {branch.address && (
                  <div>
                    <dt className="font-sans text-xs uppercase tracking-widest text-ink/70">
                      Address
                    </dt>
                    <dd className="mt-1 text-body text-ink/80">
                      {branch.address}
                      {branch.city ? `, ${branch.city}` : ''}
                      {branch.country ? `, ${branch.country}` : ''}
                    </dd>
                  </div>
                )}
                {branch.service_times && (
                  <div>
                    <dt className="font-sans text-xs uppercase tracking-widest text-ink/70">
                      Service Times
                    </dt>
                    <dd className="mt-1 text-body text-ink/80">{branch.service_times}</dd>
                  </div>
                )}
                {branch.pastor_name && (
                  <div>
                    <dt className="font-sans text-xs uppercase tracking-widest text-ink/70">
                      Campus Pastor
                    </dt>
                    <dd className="mt-1 text-body text-ink/80">{branch.pastor_name}</dd>
                  </div>
                )}
                {branch.phone && (
                  <div>
                    <dt className="font-sans text-xs uppercase tracking-widest text-ink/70">
                      Phone
                    </dt>
                    <dd className="mt-1 text-body text-ink/80">
                      <a href={`tel:${branch.phone}`} className="hover:text-gold">
                        {branch.phone}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {directions && (
                  <Button
                    href={directions}
                    variant="primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </Button>
                )}
                <Button href="/join" variant="outline">
                  Plan Your Visit
                </Button>
              </div>
            </div>

            {branch.lat != null && branch.lng != null && (
              <div className="h-[320px] w-full overflow-hidden border border-gold/30 lg:h-full">
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

      {/* What to expect — PLACEHOLDER copy, same for every branch for now */}
      <Section tone="crimson-deep">
        <Container>
          <h2 className="text-center font-display text-h2 font-semibold text-cream">
            What to Expect
          </h2>
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-3">
            {[
              {
                title: 'Parking',
                text: 'Free on-site parking is available, with team members on hand to help you find a spot.',
              },
              {
                title: 'Kids Check-In',
                text: 'A safe, fun space for your children with easy check-in at our welcome desk.',
              },
              {
                title: 'What to Wear',
                text: 'Come as you are — there is no dress code here, just come ready to worship.',
              },
            ].map((item) => (
              <div key={item.title} className="border border-gold/20 p-6 text-center">
                <h3 className="font-display text-h4 font-semibold text-gold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Upcoming events at this branch */}
      <Section tone="cream">
        <Container>
          <h2 className="font-display text-h3 font-semibold text-ink">
            Upcoming Events at {branch.name}
          </h2>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border border-ink/10 p-6">
                  {event.category && (
                    <p className="font-sans text-xs uppercase tracking-widest text-gold">
                      {event.category}
                    </p>
                  )}
                  <p className="mt-2 font-display text-h4 font-semibold text-ink">{event.title}</p>
                  <p className="mt-2 font-sans text-xs uppercase tracking-widest text-ink/70">
                    {new Date(event.start_time).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-body text-ink/70">
              No upcoming events at this branch yet — see what&apos;s happening across
              HigherLife360.
            </p>
          )}
          <div className="mt-8">
            <Button href="/events" variant="outline">
              View All Events
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
