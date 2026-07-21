import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { CinematicHero } from '@/components/sections/CinematicHero';
import { SermonCard } from '@/components/sections/SermonCard';
import { EventCard } from '@/components/sections/EventCard';
import { HigherLifePathway } from '@/components/sections/HigherLifePathway';
import { MinistriesShowcase } from '@/components/sections/MinistriesShowcase';
import { ministries } from '@/lib/ministries-data';
import { isPastEvent } from '@/lib/event-time';
import { supabase } from '@/lib/supabase';
import { UNSPLASH_WORSHIP, UNSPLASH_HERO_CHURCH_EXTERIOR } from '@/lib/unsplash-placeholders';
import { getSiteImageMap } from '@/lib/site-images';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Welcome Home',
  description:
    'HigherLife360 is a global church family, founded in 2017 in Pune, India — now 120+ branches across 10+ nations with 230,000+ people connected worldwide. Watch live, find a branch, and take your next step toward a Higher Life.',
};

const ScrollReveal = nextDynamic(() =>
  import('@/components/motion/ScrollReveal').then((mod) => mod.ScrollReveal)
);
const StaggerReveal = nextDynamic(() =>
  import('@/components/motion/StaggerReveal').then((mod) => mod.StaggerReveal)
);
const StatCounters = nextDynamic(() =>
  import('@/components/sections/StatCounters').then((mod) => mod.StatCounters)
);

// Real facts (must match /vision exactly) — founded 2017 in Pune, Maharashtra.
const impactStats = [
  { value: 120, suffix: '+', label: 'Branches' },
  { value: 230000, suffix: '+', label: 'Lives Connected' },
  { value: 10, suffix: '+', label: 'Nations' },
];

// The Summit-style closing trio — three clear front doors into the church,
// regardless of where someone is starting from.
const pathwaysTrio = [
  {
    eyebrow: 'New Here',
    title: 'Where to Start',
    text: 'Not sure what a first visit looks like? We’ll walk you through exactly what to expect, so you can show up knowing.',
    href: '/branches',
    cta: 'Plan Your Visit',
  },
  {
    eyebrow: 'Get Involved',
    title: 'Start Serving',
    text: 'Every gift matters here. Find a team that fits how you’re wired, and put it to use for something bigger.',
    href: '/join#volunteer',
    cta: 'Find a Team',
  },
  {
    eyebrow: 'Generosity',
    title: 'Online Giving',
    text: 'Give a one-time or recurring gift in seconds — every gift helps a soul encounter God, near and far.',
    href: '/donate',
    cta: 'Give Now',
  },
];

export default async function Home() {
  const [{ data: latestSermon }, { data: eventsData }, { data: branchesData }, siteImages] =
    await Promise.all([
      supabase
        .from('sermons')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase.from('events').select('*').order('start_time', { ascending: true }),
      supabase.from('branches').select('*'),
      getSiteImageMap(),
    ]);

  const events = eventsData ?? [];
  const branches = branchesData ?? [];
  const branchNameById = new Map(branches.map((branch) => [branch.id, branch.name]));
  const upcomingEvents = events.filter((event) => !isPastEvent(event)).slice(0, 3);

  const heroChapterImages = [
    siteImages.home_hero_chapter_1,
    siteImages.home_hero_chapter_2,
    siteImages.home_hero_chapter_3,
    siteImages.home_hero_chapter_4,
    siteImages.home_hero_chapter_5,
  ].filter((url): url is string => Boolean(url));

  const featuredMinistries = ministries.slice(0, 8).map((ministry) => ({
    ...ministry,
    image: siteImages[`ministry_${ministry.slug.replace(/-/g, '_')}`] ?? ministry.image,
  }));

  return (
    <main>
      <CinematicHero images={heroChapterImages.length === 5 ? heroChapterImages : undefined} />

      {/* First-time-visitor welcome — short and warm; the fuller "what to
          expect" reassurance detail (parking, dress, service length) lives
          on /branches, since it's realistically branch-specific. */}
      <Section tone="navy-elevated" id="visit">
        <Container>
          <SectionTitle
            eyebrow="First Time?"
            title="We’re Excited"
            titleAccent="That You’re Here"
            subtitle="Whether you’ve never set foot in a church before or it’s just been a while, there’s no dress code, no pressure, and no wrong way to show up."
          />
          <div className="mx-auto mt-8 max-w-2xl text-center">
            <p className="text-body text-cream/80">
              Come as you are, sit where you like — our team will help you find coffee, kids&rsquo;
              check-in, and a seat, and we&rsquo;re praying for you before you even walk through the
              door.
              {/* PLACEHOLDER: if you'd like a specific service length or format
                  stated here, confirm it and we'll add it — kept general for now
                  since it can vary by branch. */}
            </p>
            <div className="mt-8">
              <Button href="/join" variant="primary" showArrow>
                New Here? Start Here
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="navy" id="message" className="pt-0">
        <Container>
          <div className="border-t border-cream/10 pt-16">
            <SectionTitle
              eyebrow="This Week"
              title="Watch Our"
              titleAccent="Latest Message"
              subtitle="Missed Sunday? You can still catch what God is saying — wherever you are."
            />
            <p className="mx-auto mt-6 max-w-2xl text-center text-body text-cream/70">
              Every message is prayed over before it&rsquo;s preached — practical, honest, and
              rooted in Scripture. Give it fifteen minutes and see if it doesn&rsquo;t speak to
              exactly where you are today.
            </p>
            <div className="mx-auto mt-10 max-w-2xl">
              <ScrollReveal>
                {latestSermon ? (
                  <SermonCard sermon={latestSermon} />
                ) : (
                  <div className="relative overflow-hidden border border-gold/30">
                    <div className="relative aspect-video">
                      <Image
                        src={UNSPLASH_WORSHIP}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 672px, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                    </div>
                    <div className="bg-navy-elevated p-8 text-center">
                      <p className="font-display text-h4 font-semibold text-cream">
                        New messages are on their way.
                      </p>
                      <p className="mt-2 text-sm text-cream/70">
                        In the meantime, come experience it live — same presence, same power.
                      </p>
                      <div className="mt-6">
                        <Button href="/live" variant="secondary">
                          Watch Live
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="navy-elevated" id="vision-teaser" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(242,184,94,0.16), transparent 60%)',
          }}
        />
        <Container className="relative text-center">
          <ScrollReveal>
            <p className="mx-auto max-w-2xl font-display text-h2 font-semibold text-cream">
              We believe every soul was made to rise.
            </p>
            <p className="mx-auto mt-2 max-w-2xl font-display text-h2 font-semibold text-gold">
              This is more than church — it&rsquo;s a way of life.
            </p>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-cream/75">
              From one gathering in Pune, India to a family spanning the globe — the invitation has
              never changed.
            </p>
            <div className="mt-8">
              <Button href="/vision" variant="secondary" showArrow>
                Discover Our Vision
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Upcoming Events preview — pulled live from Supabase. */}
      <Section tone="navy">
        <Container>
          <SectionTitle
            eyebrow="Mark Your Calendar"
            title="Upcoming"
            titleAccent="Events"
            subtitle="Conferences, worship nights, and gatherings across the HigherLife family — find your next moment."
          />
          {upcomingEvents.length > 0 ? (
            <StaggerReveal className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  branchName={event.branch_id ? branchNameById.get(event.branch_id) : null}
                  tone="dark"
                />
              ))}
            </StaggerReveal>
          ) : (
            <p className="mx-auto mt-14 max-w-md text-center text-body text-cream/70">
              We&rsquo;re planning the next conference, worship night, and outreach as you read
              this. Check back soon, or join us this Sunday in the meantime.
            </p>
          )}
          <div className="mt-12 text-center">
            <Button href="/events" variant="outline-light" showArrow>
              See All Events
            </Button>
          </div>
        </Container>
      </Section>

      {/* Find a Branch Near You — campus-locator-style teaser; the real
          search/map lives on /branches. Uses a raw <section> (not the
          <Section> component) so the bg-fixed image layer below can sit
          behind it — SectionTitle has no color of its own for its base
          `title` line (only `titleAccent` sets its own gold), so this
          section must carry `text-cream` explicitly or the title silently
          falls back to the page's default near-black body color. */}
      <section className="relative overflow-hidden bg-navy py-24 text-center text-cream md:py-32">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-fixed bg-center opacity-25"
          style={{ backgroundImage: `url(${UNSPLASH_HERO_CHURCH_EXTERIOR})` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/80 to-navy"
        />
        <Container className="relative">
          <SectionTitle
            eyebrow="One Church · Many Locations"
            title="Find Your"
            titleAccent="HigherLife Near You"
            subtitle="120+ branches across 10+ nations, each one carrying the same heartbeat. Search by city, or let us find the nearest one for you."
          />
          <div className="mt-10">
            <Button href="/branches" variant="primary" showArrow>
              Find a Branch
            </Button>
          </div>
        </Container>
      </section>

      {/* Get Connected and Grow — ministries showcase (subset; full list on /ministries). */}
      <Section tone="navy">
        <Container>
          <SectionTitle
            eyebrow="Get Connected"
            title="Get Connected"
            titleAccent="and Grow"
            subtitle="Ministry here isn’t about filling a program — it’s about surrounding you with the right people for whatever season you’re in."
          />
          <div className="mt-16">
            <MinistriesShowcase items={featuredMinistries} tone="dark" />
          </div>
          <div className="mt-12 text-center">
            <Button href="/ministries" variant="outline-light" showArrow>
              See All Ministries
            </Button>
          </div>
        </Container>
      </Section>

      <HigherLifePathway tone="navy" />

      <Section tone="navy" id="impact" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(242,184,94,0.16), transparent 60%)',
          }}
        />
        <Container className="relative">
          <SectionTitle
            eyebrow="Our Impact"
            title="Faith in"
            titleAccent="Motion"
            subtitle="From one gathering in Pune to a family spanning the globe."
          />
          <p className="mx-auto mt-6 max-w-2xl text-center text-body text-cream/75">
            It started with a handful of people gathered in a rented hall in Pune in 2017 — one
            Sunday, one small prayer, and a big belief that God had more. Every branch since has
            carried the same heartbeat, and the story is still being written.
          </p>
          <div className="mt-14">
            <StatCounters stats={impactStats} />
          </div>
        </Container>
      </Section>

      {/* Where to Start / Start Serving / Online Giving — three clear front doors. */}
      <Section tone="navy-elevated">
        <Container>
          <div className="grid gap-12 sm:grid-cols-3">
            {pathwaysTrio.map((item) => (
              <div key={item.title} className="text-center">
                <p className="text-eyebrow font-semibold uppercase text-accent">{item.eyebrow}</p>
                <h3 className="mt-3 font-display text-h3 font-semibold text-cream">{item.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm text-cream/70">{item.text}</p>
                <div className="mt-6">
                  <Button href={item.href} variant="outline-light" showArrow>
                    {item.cta}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <section className="relative overflow-hidden bg-gold py-16 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(15,21,35,0.12), transparent 65%)',
          }}
        />
        <Container className="relative">
          <p className="font-display text-h3 font-semibold text-navy">
            Your Generosity Changes Everything
          </p>
          <p className="mx-auto mt-4 max-w-xl text-body text-navy">
            Every gift helps a soul encounter God — in Pune, and everywhere HigherLife360 reaches.
          </p>
          <div className="mt-8">
            <Button href="/donate" variant="inverse" showArrow>
              Give
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
