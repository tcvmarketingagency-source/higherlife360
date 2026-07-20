import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SermonLibrary } from '@/components/sections/SermonLibrary';
import { supabase } from '@/lib/supabase';
import { UNSPLASH_HERO_OPEN_BIBLE } from '@/lib/unsplash-placeholders';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Messages',
  description:
    'Watch and rewatch teachings from HigherLife360 that will move you toward a Higher Life.',
  openGraph: {
    title: 'Messages | HigherLife360',
    description:
      'Watch and rewatch teachings from HigherLife360 that will move you toward a Higher Life.',
  },
};

export default async function RecordingPage() {
  const { data } = await supabase
    .from('sermons')
    .select('*')
    .order('published_at', { ascending: false });

  const sermons = data ?? [];

  return (
    <main>
      <section className="relative overflow-hidden bg-navy pb-16 pt-40 text-center">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 photo.
            See src/lib/unsplash-placeholders.ts for the source. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${UNSPLASH_HERO_OPEN_BIBLE})` }}
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
            Sermon Library
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-h1 font-semibold text-cream">
            Messages
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-cream/75">
            Watch and rewatch teachings that will move you toward a Higher Life.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-body text-cream/70">
            The Word doesn&rsquo;t expire after Sunday. Whether you&rsquo;re catching up on a
            message you missed, going back to one that changed something in you, or searching for a
            word on a topic you&rsquo;re walking through right now — every message here is preached
            to be lived, not just listened to.
          </p>
        </Container>
      </section>

      <SermonLibrary sermons={sermons} />

      <section className="border-t border-gold/10 bg-navy py-14 text-center">
        <Container>
          <p className="font-display text-h4 font-semibold text-cream">Never miss a message.</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-cream/70">
            New teachings go up every week. Subscribe so the next one finds you — on your commute,
            during a workout, or whenever you need it most.
          </p>
          <div className="mt-6">
            {/* PLACEHOLDER: link to the real YouTube channel */}
            <Button href="#" variant="secondary" target="_blank" rel="noopener noreferrer">
              Subscribe on YouTube
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
