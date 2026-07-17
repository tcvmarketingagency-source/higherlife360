import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { HeroParticlesCanvas } from '@/components/three/HeroParticlesCanvas';
import { SermonCard } from '@/components/sections/SermonCard';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Welcome Home',
  description:
    'HigherLife360 is a global church family, rooted in Pune, India, with 120+ branches across 10+ nations. Watch live, find a branch, and take your next step toward a Higher Life.',
};

const ScrollReveal = nextDynamic(() =>
  import('@/components/motion/ScrollReveal').then((mod) => mod.ScrollReveal)
);
const StatCounters = nextDynamic(() =>
  import('@/components/sections/StatCounters').then((mod) => mod.StatCounters)
);

const impactStats = [
  { value: 5000, suffix: '+', label: 'Lives Changed' },
  { value: 12, suffix: '', label: 'Branches' },
  { value: 8, suffix: '', label: 'Nations' },
];

const connectCards = [
  { title: 'Live', description: 'Join us in real time from anywhere in the world.', href: '/live' },
  { title: 'Branches', description: 'Find a HigherLife360 campus near you.', href: '/branches' },
  { title: 'Events', description: 'See what’s happening this month and beyond.', href: '/events' },
  {
    title: 'Join Us',
    description: 'Take your next step into community and calling.',
    href: '/join',
  },
];

export default async function Home() {
  const { data: latestSermon } = await supabase
    .from('sermons')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <main>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-crimson via-crimson-deep to-ink">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, rgba(232,200,120,0.16), transparent 60%)',
          }}
        />
        <HeroParticlesCanvas />

        <Container className="relative py-32 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-gold/60 sm:h-28 sm:w-28">
            <span className="font-display text-2xl font-semibold text-gold">HL</span>
          </div>
          <h1 className="mx-auto max-w-4xl font-display text-hero font-semibold text-cream">
            Welcome Home.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-body-lg text-cream/75">
            A place to encounter God, find family, and live a Higher Life.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Button href="/#visit" variant="primary">
              Plan Your Visit
            </Button>
            <Button href="/live" variant="secondary">
              Watch Live
            </Button>
          </div>
        </Container>

        <a
          href="#visit"
          aria-label="Scroll down"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-cream/60 transition-colors hover:text-gold"
        >
          <span aria-hidden className="text-2xl">
            &#8595;
          </span>
        </a>
      </section>

      <section id="visit" className="border-b border-gold/10 bg-crimson-deep py-6">
        <Container className="flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
          <p className="font-sans text-sm text-cream/80">New here? We’d love to meet you.</p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-widest text-gold transition-colors hover:text-gold-light"
          >
            I’m New <span aria-hidden>&rarr;</span>
          </Link>
        </Container>
      </section>

      <Section tone="cream" id="message">
        <Container>
          <SectionTitle eyebrow="This Week" title="Current Message" />
          <div className="mx-auto mt-14 max-w-2xl">
            {latestSermon ? (
              <SermonCard sermon={latestSermon} />
            ) : (
              <p className="text-center font-sans text-body text-ink/70">
                Check back soon for our latest message.
              </p>
            )}
          </div>
        </Container>
      </Section>

      <Section tone="crimson-deep" id="vision-teaser">
        <Container className="text-center">
          <ScrollReveal>
            <p className="mx-auto max-w-2xl font-display text-h2 font-semibold text-cream">
              We believe every soul was made to rise.
            </p>
            <p className="mx-auto mt-2 max-w-2xl font-display text-h2 font-semibold text-gold">
              This is more than church — it’s a way of life.
            </p>
            <div className="mt-8">
              <Button href="/vision" variant="secondary">
                Discover Our Vision
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      <Section tone="cream" id="connect">
        <Container>
          <SectionTitle eyebrow="Get Involved" title="Ways to Connect" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {connectCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group block border border-ink/10 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-xl"
              >
                <h3 className="font-display text-h4 font-semibold text-ink transition-colors group-hover:text-crimson">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-ink/70">{card.description}</p>
                <span
                  aria-hidden
                  className="mt-6 inline-block text-gold transition-transform group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="crimson-deep" id="impact">
        <Container>
          <SectionTitle
            eyebrow="Our Impact"
            title="Faith in Motion"
            subtitle="A movement reaching further every year."
          />
          <div className="mt-14">
            <StatCounters stats={impactStats} />
          </div>
        </Container>
      </Section>

      <section className="bg-gold py-14 text-center">
        <Container>
          <p className="font-display text-h3 font-semibold text-crimson-deep">Fuel the Mission</p>
          <div className="mt-6">
            <Button href="/donate" variant="inverse">
              Give
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
