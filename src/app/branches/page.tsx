import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BranchesExplorer } from '@/components/sections/BranchesExplorer';
import { supabase } from '@/lib/supabase';
import { UNSPLASH_HERO_BACKGROUND } from '@/lib/unsplash-placeholders';

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
  const { data } = await supabase.from('branches').select('*').order('name', { ascending: true });

  const branches = data ?? [];

  return (
    <main>
      <section className="relative overflow-hidden bg-crimson-deep pb-16 pt-40 text-center">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 worship
            photo. Verified free (non-Unsplash+) at time of writing. See
            src/lib/unsplash-placeholders.ts for the source. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${UNSPLASH_HERO_BACKGROUND})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-crimson-deep/80" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 20%, rgba(232,200,120,0.14), transparent 55%)',
          }}
        />
        <Container className="relative">
          <p className="text-eyebrow font-semibold uppercase text-gold">Our Branches</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-h1 font-semibold text-cream">
            Find Your HigherLife
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-cream/75">
            120+ branches. 10+ nations. One family. Find a home near you.
          </p>
        </Container>
      </section>

      <BranchesExplorer branches={branches} />

      <section className="bg-gold py-14 text-center">
        <Container>
          <p className="font-display text-h3 font-semibold text-crimson-deep">
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
