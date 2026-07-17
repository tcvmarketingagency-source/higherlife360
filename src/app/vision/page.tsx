import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { HeroTextReveal } from '@/components/motion/HeroTextReveal';
import founderPortraitPlaceholder from '@/assets/placeholders/founder-portrait.svg';

const ScrollReveal = dynamic(() =>
  import('@/components/motion/ScrollReveal').then((mod) => mod.ScrollReveal)
);
const StaggerReveal = dynamic(() =>
  import('@/components/motion/StaggerReveal').then((mod) => mod.StaggerReveal)
);
const StoryTimeline = dynamic(() =>
  import('@/components/sections/StoryTimeline').then((mod) => mod.StoryTimeline)
);
const StatCounters = dynamic(() =>
  import('@/components/sections/StatCounters').then((mod) => mod.StatCounters)
);

export const metadata: Metadata = {
  title: 'Our Vision',
  description:
    'Discover the vision, values, and story behind HigherLife360 — a church devoted to helping every person encounter God and live a Higher Life.',
  openGraph: {
    title: 'Our Vision | HigherLife360',
    description:
      'Discover the vision, values, and story behind HigherLife360 — a church devoted to helping every person encounter God and live a Higher Life.',
  },
};

// PLACEHOLDER: swap first-letter monograms for a real icon set when one is chosen.
const beliefs = [
  {
    title: 'God',
    text: 'One God, eternally present as Father, Son, and Holy Spirit.',
  },
  {
    title: 'The Bible',
    text: 'God’s living Word — our foundation for faith and life.',
  },
  {
    title: 'Salvation',
    text: 'Freely given through Jesus, available to everyone who believes.',
  },
  {
    title: 'The Church',
    text: 'A family, not a building — we belong to one another.',
  },
  {
    title: 'Generosity',
    text: 'We give because we were first given to, without measure.',
  },
  {
    title: 'The Higher Life',
    text: 'A life of purpose, freedom, and lasting impact.',
  },
];

const coreValues = [
  { number: '01', title: 'Presence', text: 'We pursue God above everything else.' },
  { number: '02', title: 'People', text: 'Everyone matters, always.' },
  { number: '03', title: 'Excellence', text: 'We honor God with our best.' },
  { number: '04', title: 'Generosity', text: 'We live open-handed.' },
];

const globalReachStats = [
  { value: 120, suffix: '+', label: 'Branches' },
  { value: 230000, suffix: '+', label: 'Lives Connected' },
  { value: 10, suffix: '+', label: 'Nations' },
];

export default function VisionPage() {
  return (
    <main>
      {/* 1. Hero statement */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-crimson-deep">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(232,200,120,0.16), transparent 60%)',
          }}
        />
        <Container className="relative py-32 text-center">
          <HeroTextReveal className="mx-auto max-w-4xl font-display text-hero font-semibold text-cream">
            We exist to help every person encounter God and live a Higher Life.
          </HeroTextReveal>
          <p className="mx-auto mt-8 max-w-xl text-body-lg text-cream/75">
            This is our heartbeat — the vision that shapes everything we do.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm uppercase tracking-[0.2em] text-gold">
            Born in Pune, India. Now a global family.
          </p>
        </Container>

        <a
          href="#founder"
          aria-label="Scroll down"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-cream/60 transition-colors hover:text-gold"
        >
          <span aria-hidden className="text-2xl">
            &#8595;
          </span>
        </a>
      </section>

      {/* 2. Apostle / Founder's Message */}
      <Section tone="cream" id="founder">
        <Container>
          <ScrollReveal>
            <div className="grid items-center gap-16 md:grid-cols-2">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border-2 border-gold">
                {/* PLACEHOLDER: replace with the real portrait photo */}
                <Image
                  src={founderPortraitPlaceholder}
                  alt="Portrait of Pastor Sushil, Founder & Lead Pastor"
                  fill
                  sizes="(min-width: 768px) 400px, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-eyebrow font-semibold uppercase text-gold">
                  A Word From Our Pastor
                </p>
                <h2 className="mt-3 font-display text-h2 font-semibold text-ink">
                  A Personal Welcome
                </h2>
                {/* Intro line updated with real founding facts (Pune, 2017, global growth). */}
                {/* PLACEHOLDER: paste Pastor Sushil's real full message here — the two */}
                {/* paragraphs below the intro line are still placeholder text. */}
                <div className="mt-6 space-y-4 text-body text-ink/80">
                  <p>
                    What began in a small gathering in Pune, Maharashtra in 2017 has grown into a
                    global movement — but the heart behind it has never changed: every person
                    deserves a place to encounter God and discover who they were truly created to
                    be.
                  </p>
                  <p>
                    Whatever brought you here today — curiosity, a friend’s invitation, or a quiet
                    search for something more — you are welcome. This is a family, and there is a
                    seat for you at the table.
                  </p>
                  <p>
                    My prayer is that HigherLife360 becomes a light in every city it touches —
                    raising up a generation that lives free, gives generously, and carries hope
                    wherever they go.
                  </p>
                </div>
                <p className="mt-6 font-display text-h4 italic text-crimson">
                  — Pastor Sushil, Founder &amp; Lead Pastor, HigherLife
                </p>
                <div className="mt-6">
                  {/* PLACEHOLDER: link to the real founder message video once available. */}
                  <Button href="#" variant="outline">
                    Watch the Full Message
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* 3. What We Believe */}
      <Section tone="crimson-deep" id="believe">
        <Container>
          <SectionTitle
            eyebrow="Our Foundation"
            title="What We Believe"
            subtitle="The truths that anchor everything we do."
          />
          <StaggerReveal className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beliefs.map((belief) => (
              <div
                key={belief.title}
                className="border border-gold/20 bg-crimson-deep p-8 transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_40px_-10px_rgba(201,162,75,0.5)]"
              >
                {/* PLACEHOLDER: icon — currently a first-letter monogram */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/60">
                  <span className="font-display text-xl text-gold">{belief.title.charAt(0)}</span>
                </div>
                <h3 className="mt-6 font-display text-h4 font-semibold text-cream">
                  {belief.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{belief.text}</p>
              </div>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      {/* 4. Core Values */}
      <Section tone="cream" id="values">
        <Container>
          <SectionTitle eyebrow="How We Live" title="What We Value" />
          <StaggerReveal className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => (
              <div key={value.number} className="text-center sm:text-left">
                <p className="font-display text-h3 font-semibold text-gold/40">{value.number}</p>
                <h3 className="mt-2 font-display text-h3 font-semibold text-ink">{value.title}</h3>
                <p className="mt-3 text-sm text-ink/70">{value.text}</p>
              </div>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      {/* 5. Our Story — animated timeline */}
      <Section tone="crimson-deep" id="story">
        <Container>
          <SectionTitle
            eyebrow="Our Journey"
            title="Our Story"
            subtitle="From a small beginning to a growing global family."
          />
          <div className="mt-16">
            <StoryTimeline />
          </div>
        </Container>
      </Section>

      {/* 6. Our Global Reach (formerly "Vision 2030") */}
      <Section tone="crimson-deep" id="global-reach" className="relative overflow-hidden pt-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(232,200,120,0.16), transparent 60%)',
          }}
        />
        <Container className="relative text-center">
          <p className="text-eyebrow font-semibold uppercase text-gold">Our Reach</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-h1 font-semibold text-cream">
            Our Global Reach
          </h2>
          <div className="mx-auto mt-14 max-w-3xl">
            <StatCounters stats={globalReachStats} />
          </div>
          <p className="mx-auto mt-14 max-w-xl text-body-lg text-cream/75">
            From one city in India to a global family — and we’re just getting started.
          </p>
          <div className="mt-8">
            <Button href="/join" variant="primary">
              Join the Vision
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
