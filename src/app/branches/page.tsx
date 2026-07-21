import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BranchesExplorer } from '@/components/sections/BranchesExplorer';
import { supabase } from '@/lib/supabase';
import { UNSPLASH_HERO_BACKGROUND } from '@/lib/unsplash-placeholders';
import { getSiteImageMap } from '@/lib/site-images';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Branches',
  description:
    'Explore HigherLife360 branches across 120+ locations and 10+ countries, rooted in Pune, India. Find a home near you.',
  openGraph: {
    title: 'Branches | HigherLife360',
    description:
      'Explore HigherLife360 branches across 120+ locations and 10+ countries, rooted in Pune, India. Find a home near you.',
    images: [{ url: UNSPLASH_HERO_BACKGROUND }],
  },
};

export default async function BranchesPage() {
  const [{ data }, siteImages] = await Promise.all([
    supabase.from('branches').select('*').order('name', { ascending: true }),
    getSiteImageMap(),
  ]);

  const branches = data ?? [];
  const heroImage = siteImages.branches_hero ?? UNSPLASH_HERO_BACKGROUND;

  return (
    <main>
      <section className="relative overflow-hidden bg-navy pb-16 pt-40 text-center">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 worship
            photo, or via /admin/site-images (key: branches_hero). */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
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
            Our Branches
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-h1 font-semibold text-cream">
            Find Your HigherLife
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-cream/75">
            120+ branches. 10+ nations. One family. Find a home near you.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-body text-cream/70">
            It started with one room in Pune, Maharashtra — and it kept going. Today HigherLife360
            is a genuine global family: 120+ branches across 10+ nations, each one shaped by its own
            city and culture, but carrying the exact same heartbeat back to where it all began.
          </p>
        </Container>
      </section>

      {/* What to Expect — anxiety-reducing detail for first-time visitors.
          PLACEHOLDER: these are deliberately kept general since specifics
          (parking, exact kids' program, dress norms) can vary branch to
          branch — confirm and personalize per-branch detail if you'd like it
          more specific than this. */}
      <section className="border-b border-ink/10 bg-white py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow font-semibold uppercase text-gold-deep">
              First Time Visiting?
            </p>
            <h2 className="mt-3 font-display text-h2 font-semibold text-ink">
              Here&rsquo;s What to Expect
            </h2>
            <p className="mt-4 text-body text-ink/70">
              We know walking into a new church for the first time can feel like a lot. Here&rsquo;s
              what most Sundays look like, so you can show up knowing exactly what to expect.
            </p>
          </div>
          <div className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'What to Wear',
                text: 'Come as you are. You’ll see everything from jeans to traditional wear — there’s no dress code here.',
              },
              {
                title: 'Kids & Family',
                text: 'Most branches offer a kids’ program during the service — ask a greeter when you arrive and they’ll walk you through check-in.',
              },
              {
                title: 'Parking & Arrival',
                text: 'Arrive a little early on your first visit — greeters at the door can help with parking, seating, and any questions.',
              },
              {
                title: 'How Long It Runs',
                text: 'Services typically run about an hour to ninety minutes, including worship, teaching, and a time of response.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <h3 className="font-display text-h4 font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{item.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <BranchesExplorer branches={branches} />

      <section className="bg-gold py-14 text-center">
        <Container>
          <p className="font-display text-h3 font-semibold text-navy">
            Don&apos;t see a branch near you? We&apos;re growing fast.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Button href="/live" variant="inverse">
              Watch Online
            </Button>
            <Button href="/join" variant="inverse">
              Start a HigherLife Near You
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
