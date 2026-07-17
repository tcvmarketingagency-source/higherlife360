import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SermonLibrary } from '@/components/sections/SermonLibrary';
import { supabase } from '@/lib/supabase';

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
      <section className="relative overflow-hidden bg-crimson-deep pb-16 pt-40 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 20%, rgba(232,200,120,0.14), transparent 55%)',
          }}
        />
        <Container className="relative">
          <p className="text-eyebrow font-semibold uppercase text-gold">Sermon Library</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-h1 font-semibold text-cream">
            Messages
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-cream/75">
            Watch and rewatch teachings that will move you toward a Higher Life.
          </p>
        </Container>
      </section>

      <SermonLibrary sermons={sermons} />

      <section className="border-t border-gold/10 bg-crimson-deep py-14 text-center">
        <Container>
          <p className="font-display text-h4 font-semibold text-cream">Never miss a message.</p>
          <p className="mt-2 text-sm text-cream/70">
            Subscribe to our channel for new messages every week.
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
