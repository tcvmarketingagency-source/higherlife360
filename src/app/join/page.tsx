import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { JoinPageProvider } from '@/components/sections/JoinPageProvider';
import { JoinActionButton } from '@/components/sections/JoinActionButton';
import { ConnectCardForm } from '@/components/forms/ConnectCardForm';
import {
  UNSPLASH_HERO_FELLOWSHIP,
  UNSPLASH_FELLOWSHIP,
  UNSPLASH_OPEN_BIBLE,
  UNSPLASH_SMALL_GROUP,
  UNSPLASH_FAMILY_PEWS,
  UNSPLASH_CANDLE,
} from '@/lib/unsplash-placeholders';
import { getSiteImageMap } from '@/lib/site-images';

export const metadata: Metadata = {
  title: 'Join Us',
  description:
    'Wherever you are on your journey, there’s a next step for you at HigherLife360. Plan a visit, join a small group, get baptized, serve, or become a member.',
  openGraph: {
    title: 'Join Us | HigherLife360',
    description:
      'Wherever you are on your journey, there’s a next step for you at HigherLife360. Plan a visit, join a small group, get baptized, serve, or become a member.',
  },
};

const nextSteps = [
  {
    mark: 'P',
    title: 'Plan a Visit',
    text: 'New here? Let us roll out the welcome. Find a branch, check the service times, and come see what a Sunday actually feels like — no pressure, just an open door.',
    action: { type: 'link' as const, href: '/branches' },
  },
  {
    mark: 'G',
    title: 'Join a Small Group',
    text: 'Life is better in community. A small group is where faith stops being a Sunday-only thing — real conversations, real friendship, and people who’ll walk with you.',
    action: { type: 'scroll' as const, target: '#small-groups' },
  },
  {
    mark: 'B',
    title: 'Get Baptized',
    text: 'Ready to take a public step of faith? Baptism is a simple, meaningful declaration of what God has already done in you — we’d be honored to walk with you through it.',
    action: { type: 'prefill' as const, interest: 'Baptism' },
  },
  {
    mark: 'S',
    title: 'Serve on a Team',
    text: 'Use your gifts to make a difference. Whatever you’re good at — hospitality, tech, kids, worship — there’s a team here that needs exactly that.',
    action: { type: 'scroll' as const, target: '#volunteer' },
  },
  {
    mark: 'M',
    title: 'Become a Member',
    text: 'Make HigherLife your home and go deeper. Membership is less a formality and more a commitment — to belong, to serve, and to be known here for the long haul.',
    action: { type: 'prefill' as const, interest: 'Membership' },
  },
];

// PLACEHOLDER: sample small groups — replace with real groups. Consider a
// `small_groups` Supabase table down the line so this section can be
// data-driven the same way sermons/branches/events are.
const sampleGroups = [
  {
    name: 'Young Adults Connect',
    day: 'Tuesdays',
    time: '7:00 PM',
    location: 'HigherLife Pune',
    description:
      'A space for 20s & 30s to grow in faith and friendship together — real talk about work, relationships, and figuring out life, held together by scripture and community.',
    photo: UNSPLASH_FELLOWSHIP,
  },
  {
    name: 'Women’s Bible Study',
    day: 'Wednesdays',
    time: '10:00 AM',
    location: 'HigherLife Mumbai',
    description:
      'Digging into scripture together in a warm, honest environment where questions are welcome and nobody has to have it all figured out.',
    photo: UNSPLASH_OPEN_BIBLE,
  },
  {
    name: 'Men’s Fellowship',
    day: 'Thursdays',
    time: '6:30 PM',
    location: 'HigherLife Pune',
    description:
      'Real conversations, real accountability, real brotherhood — a place to be honest about the pressures of work, family, and faith, without performing for anyone.',
    photo: UNSPLASH_SMALL_GROUP,
  },
  {
    name: 'Young Families',
    day: 'Saturdays',
    time: '4:00 PM',
    location: 'HigherLife Bengaluru',
    description:
      'Connecting parents navigating faith and family life together — practical support, honest friendship, and kids welcome (in fact, expected).',
    photo: UNSPLASH_FAMILY_PEWS,
  },
];

const volunteerTeams = [
  {
    mark: 'W',
    title: 'Worship',
    text: 'Music & production — if you sing, play, or simply love creating an atmosphere where people can meet God, this team turns that gift into leadership every single week.',
  },
  {
    mark: 'M',
    title: 'Media & Tech',
    text: 'Streaming, sound, and cameras — the quiet, essential work that makes sure no one misses a word, whether they’re in the room or watching from another country.',
  },
  {
    mark: 'H',
    title: 'Hospitality',
    text: 'Welcome & connect — be the first friendly face someone meets on what might be the most nervous, hopeful walk of their week. Small kindness, huge impact.',
  },
  {
    mark: 'K',
    title: 'Kids',
    text: 'HigherLife Kids ministry — invest in the next generation with games, stories, and truth that sticks, so every child who walks through our doors feels seen and loved.',
  },
  {
    mark: 'O',
    title: 'Outreach',
    text: 'Serving the community — carry HigherLife beyond our walls through food drives, practical help, and simply showing up for our neighbors, no strings attached.',
  },
];

export default async function JoinPage() {
  const siteImages = await getSiteImageMap();
  const heroImage = siteImages.join_hero ?? UNSPLASH_HERO_FELLOWSHIP;

  return (
    <JoinPageProvider>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-navy pb-16 pt-40 text-center">
          {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360
              community/welcome photo, or via /admin/site-images (key: join_hero). */}
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
              Join Us
            </p>
            <h1 className="mx-auto mt-4 max-w-2xl font-display text-h1 font-semibold text-cream">
              You Belong Here.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-body-lg text-cream/75">
              Wherever you are on your journey, there’s a next step for you at HigherLife. Let’s
              take it together.
            </p>
            <div className="mt-10">
              <JoinActionButton target="#connect-card" variant="primary">
                Take Your Next Step
              </JoinActionButton>
            </div>
          </Container>
        </section>

        {/* Next Steps */}
        <Section tone="cream">
          <Container>
            <SectionTitle eyebrow="Get Connected" title="Find Your Next Step" />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nextSteps.map((step) => (
                <div
                  key={step.title}
                  className="flex flex-col border border-ink/10 bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_40px_-10px_rgba(232,163,61,0.5)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/60">
                    <span className="font-display text-lg text-gold-deep">{step.mark}</span>
                  </div>
                  <h3 className="mt-5 font-display text-h4 font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink/70">{step.text}</p>
                  <div className="mt-6">
                    {step.action.type === 'link' ? (
                      <Button href={step.action.href} variant="outline">
                        Learn More
                      </Button>
                    ) : step.action.type === 'scroll' ? (
                      <JoinActionButton target={step.action.target} variant="outline">
                        Learn More
                      </JoinActionButton>
                    ) : (
                      <JoinActionButton
                        target="#connect-card"
                        interest={step.action.interest}
                        variant="outline"
                      >
                        Get Started
                      </JoinActionButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* New here? / New believer path */}
        <Section tone="navy" className="relative overflow-hidden">
          {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 photo.
              See src/lib/unsplash-placeholders.ts for the source. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-cover bg-fixed bg-center opacity-25"
            style={{ backgroundImage: `url(${UNSPLASH_CANDLE})` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/85 to-navy"
          />
          <Container className="relative text-center">
            <div className="mx-auto max-w-2xl">
              <p className="text-eyebrow font-semibold uppercase text-accent">New Here?</p>
              <h2 className="mt-3 font-display text-h2 font-semibold text-cream">
                Just Started Your Journey with Jesus?
              </h2>
              <p className="mt-6 text-body text-cream/80">
                Whatever brought you here — a question, a quiet curiosity, a hard season, or a
                decision you’ve already made — there’s no wrong way to start. This isn’t a test you
                can fail or a club you have to earn your way into. It’s simply the beginning of a
                relationship.
              </p>
              <p className="mt-4 text-body text-cream/80">
                You don’t need to have your doubts resolved, your habits fixed, or your questions
                answered before you take this step. You just need to take it — and we’ll walk the
                rest with you, at whatever pace you need.
              </p>
              <div className="mt-8">
                <JoinActionButton
                  target="#connect-card"
                  interest="New Believer"
                  note="I just gave my life to Christ and want to take my next step."
                  variant="secondary"
                >
                  Start Here
                </JoinActionButton>
              </div>
            </div>
          </Container>
        </Section>

        {/* Small Groups finder */}
        <Section tone="cream" id="small-groups">
          <Container>
            <SectionTitle
              eyebrow="Community"
              title="Find a Small Group"
              subtitle="Life is better together. Find a group that fits your season."
            />

            {/* PLACEHOLDER: these filters are UI-only for now — wire up to
                real data once small groups come from a `small_groups` table. */}
            <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-4">
              {[
                {
                  label: 'Day',
                  options: ['Any Day', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Saturdays'],
                },
                { label: 'Branch', options: ['Any Branch', 'Pune', 'Mumbai', 'Bengaluru'] },
                {
                  label: 'Type',
                  options: ['Any Type', 'Men', 'Women', 'Youth', 'Couples', 'Bible Study'],
                },
              ].map((filter) => (
                <select
                  key={filter.label}
                  defaultValue={filter.options[0]}
                  aria-label={filter.label}
                  className="border border-ink/20 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-gold focus:outline-none"
                >
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ))}
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {sampleGroups.map((group) => (
                <div
                  key={group.name}
                  className="overflow-hidden border border-gold/20 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-[0_0_40px_-10px_rgba(232,163,61,0.5)]"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={group.photo}
                      alt={group.name}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-h4 font-semibold text-ink">{group.name}</h3>
                    <p className="mt-1 font-sans text-xs uppercase tracking-widest text-gold-deep">
                      {group.day} · {group.time}
                    </p>
                    <p className="mt-1 text-sm text-ink/70">{group.location}</p>
                    <p className="mt-3 text-sm text-ink/70">{group.description}</p>
                    <div className="mt-6">
                      <JoinActionButton
                        target="#connect-card"
                        interest="Small Group"
                        note={`I'm interested in joining: ${group.name}`}
                        variant="outline"
                      >
                        Join This Group
                      </JoinActionButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Volunteer / Serve teams */}
        <Section tone="navy" id="volunteer">
          <Container>
            <SectionTitle
              eyebrow="Get Involved"
              title="Serve With Us"
              subtitle="Use your gifts to help build something bigger than yourself."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {volunteerTeams.map((team) => (
                <div key={team.title} className="border border-gold/20 p-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/60">
                    <span className="font-display text-lg text-gold">{team.mark}</span>
                  </div>
                  <h3 className="mt-5 font-display text-h4 font-semibold text-cream">
                    {team.title}
                  </h3>
                  <p className="mt-2 text-sm text-cream/70">{team.text}</p>
                  <div className="mt-6">
                    <JoinActionButton
                      target="#connect-card"
                      interest="Volunteering"
                      note={`I'd like to volunteer on the ${team.title} team.`}
                      variant="secondary"
                    >
                      Join This Team
                    </JoinActionButton>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Connect Card */}
        <Section tone="cream" id="connect-card">
          <Container>
            <SectionTitle eyebrow="Take the Next Step" title="Let’s Connect" />
            <div className="mx-auto mt-14 max-w-2xl">
              <ConnectCardForm />
              <p className="mt-6 text-center text-sm text-ink/70">
                Need prayer? Just choose &ldquo;Prayer Request&rdquo; above — our team prays over
                every request.
              </p>
            </div>
          </Container>
        </Section>
      </main>
    </JoinPageProvider>
  );
}
