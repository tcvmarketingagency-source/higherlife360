import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { HeroTextReveal } from '@/components/motion/HeroTextReveal';
import { HigherLifePathway } from '@/components/sections/HigherLifePathway';
import founderPortraitPlaceholder from '@/assets/placeholders/founder-portrait.svg';
import { UNSPLASH_HERO_CATHEDRAL_INTERIOR, UNSPLASH_CANDLE } from '@/lib/unsplash-placeholders';

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

// PLACEHOLDER: swap first-letter monograms for a real icon set when one is
// chosen. PLACEHOLDER: this wording is a faithful, generic evangelical
// statement of faith — please review each line against HigherLife360's
// actual doctrinal statement (if a more formal one exists) before launch.
const beliefs = [
  {
    title: 'God',
    text: 'One God, eternally present as Father, Son, and Holy Spirit — not distant, but near. He knows you fully and loves you completely, and everything we do flows from that relationship.',
  },
  {
    title: 'The Bible',
    text: 'God’s living Word, given to guide, correct, and grow us. We don’t just read it on Sundays — we build our lives on it, trusting it to speak into every season we walk through.',
  },
  {
    title: 'Salvation',
    text: 'Freely given through Jesus — not earned by effort, religion, or good behavior. It’s available to absolutely everyone who believes, no matter where they’ve been or what they’ve done.',
  },
  {
    title: 'The Church',
    text: 'A family, not a building. We gather to worship, but we belong to one another beyond the walls — carrying each other through joy, loss, doubt, and everything in between.',
  },
  {
    title: 'Generosity',
    text: 'We give because we were first given to, without measure. That shapes how we handle money, time, and attention — open-handed, not clenched, trusting there is always more where that came from.',
  },
  {
    title: 'The Higher Life',
    text: 'A life of purpose, freedom, and lasting impact — not perfection. It’s the ongoing journey of becoming who God made you to be, one step of obedience and faith at a time.',
  },
];

const coreValues = [
  {
    number: '01',
    title: 'Presence',
    text: 'We pursue God above everything else — before strategy, before numbers, before anything we could build ourselves. Everything else follows from this one priority.',
  },
  {
    number: '02',
    title: 'People',
    text: 'Everyone matters, always — not as a program to run, but as a person to know. We slow down for the one, because that’s exactly how Jesus led.',
  },
  {
    number: '03',
    title: 'Excellence',
    text: 'We honor God with our best, not our leftovers. From how we plan a service to how we care for a single conversation, small details are never an afterthought here.',
  },
  {
    number: '04',
    title: 'Generosity',
    text: 'We live open-handed — with our resources, our homes, and our time. Generosity isn’t a giving campaign to us; it’s simply how we’ve chosen to move through the world.',
  },
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
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-navy">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 sanctuary
            photo. See src/lib/unsplash-placeholders.ts for the source. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${UNSPLASH_HERO_CATHEDRAL_INTERIOR})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-navy/90" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(242,184,94,0.16), transparent 60%)',
          }}
        />
        <Container className="relative py-32 text-center">
          <HeroTextReveal className="mx-auto max-w-4xl font-display text-hero font-semibold text-cream [text-shadow:0_4px_24px_rgb(0_0_0_/_45%)]">
            We exist to help every person encounter God and live a Higher Life.
          </HeroTextReveal>
          <p className="mx-auto mt-8 max-w-xl text-body-lg text-cream/75">
            This is our heartbeat — the vision that shapes everything we do.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm uppercase tracking-[0.2em] text-gold [text-shadow:0_1px_10px_rgb(0_0_0_/_60%)]">
            Born in Pune, India. Now a global family.
          </p>
        </Container>

        <a
          href="#founder"
          aria-label="Scroll down"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 transition-colors hover:text-gold motion-safe:animate-bounce"
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
                <p className="text-eyebrow font-semibold uppercase text-accent">
                  A Word From Our Pastor
                </p>
                <h2 className="mt-3 font-display text-h2 font-semibold text-ink">
                  A Personal Welcome
                </h2>
                {/* PLACEHOLDER — WRITTEN IN PASTOR SUSHIL'S VOICE AS A STAND-IN.
                    This is high-quality placeholder copy built only from the
                    confirmed facts (Pune, Maharashtra, founded 2017) — it is
                    NOT anything Pastor Sushil has actually said or written.
                    Please replace this entire block with his real words (or
                    have him review/edit this draft) before launch. */}
                <div className="mt-6 space-y-4 text-body text-ink/80">
                  <p>
                    In 2017, in a small rented hall in Pune, Maharashtra, a handful of us gathered
                    with nothing but a conviction: that God wasn’t finished with this city, or with
                    the people in it. We didn’t have a building, a budget, or a plan beyond that
                    Sunday — just a hunger to see lives changed, and a belief that if we made room
                    for God’s presence, He would show up. He did. And He hasn’t stopped since.
                  </p>
                  <p>
                    I didn’t start HigherLife360 to build an organization. I started it because I’d
                    seen what happens when ordinary people encounter God for themselves — not
                    through a program, but through a real, tangible presence — and I couldn’t shake
                    the conviction that everyone deserved that same chance. That’s still the
                    heartbeat behind every branch we plant and every service we hold, whether it’s
                    in Pune or on the other side of the world.
                  </p>
                  <p>
                    So whatever brought you here today — curiosity, a friend’s invitation, a hard
                    season, or a quiet search for something more — you are welcome, exactly as you
                    are. This isn’t a place you have to clean yourself up to enter. It’s a family,
                    and there is a seat for you at the table.
                  </p>
                  <p>
                    My prayer is that HigherLife360 becomes a light in every city it touches —
                    raising up a generation that lives free, gives generously, and carries hope
                    wherever they go. I’m honored you’re here. Let’s take this next step together.
                  </p>
                </div>
                <p className="mt-6 font-display text-h4 italic text-navy-elevated">
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
      <Section tone="navy" id="believe">
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
                className="border border-gold/20 bg-navy p-8 transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_40px_-10px_rgba(232,163,61,0.5)]"
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
                <p className="font-display text-h3 font-semibold text-accent/40">{value.number}</p>
                <h3 className="mt-2 font-display text-h3 font-semibold text-ink">{value.title}</h3>
                <p className="mt-3 text-sm text-ink/70">{value.text}</p>
              </div>
            ))}
          </StaggerReveal>
        </Container>
      </Section>

      <HigherLifePathway />

      {/* 5. Our Story — animated timeline */}
      <Section tone="navy" id="story" className="relative overflow-hidden">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 photo.
            See src/lib/unsplash-placeholders.ts for the source. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-fixed bg-center opacity-20"
          style={{ backgroundImage: `url(${UNSPLASH_CANDLE})` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/90 to-navy"
        />
        <Container className="relative">
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
      <Section tone="navy" id="global-reach" className="relative overflow-hidden pt-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(242,184,94,0.16), transparent 60%)',
          }}
        />
        <Container className="relative text-center">
          <p className="text-eyebrow font-semibold uppercase text-accent">Our Reach</p>
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
