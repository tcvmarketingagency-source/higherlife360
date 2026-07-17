import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { LiveHero } from '@/components/sections/LiveHero';
import { serviceSchedule, WEEKDAY_LABELS } from '@/lib/live-config';
import { formatServiceTime } from '@/lib/live-status';

export const metadata: Metadata = {
  title: 'Watch Live',
  description:
    'Join HigherLife360 for live services online, or check our weekly service schedule and never miss a message.',
  openGraph: {
    title: 'Watch Live | HigherLife360',
    description:
      'Join HigherLife360 for live services online, or check our weekly service schedule and never miss a message.',
  },
};

export default function LivePage() {
  const groupedSchedule = new Map<number, string[]>();
  serviceSchedule.forEach((service) => {
    const list = groupedSchedule.get(service.day) ?? [];
    list.push(formatServiceTime(service.time));
    groupedSchedule.set(service.day, list);
  });
  const scheduleDays = Array.from(groupedSchedule.entries()).sort(([a], [b]) => a - b);

  return (
    <main>
      <Section tone="crimson-deep" className="pb-16 pt-40">
        <Container>
          <div className="mb-10 text-center">
            <p className="text-eyebrow font-semibold uppercase text-gold">Watch Live</p>
            <h1 className="mt-3 font-display text-h1 font-semibold text-cream">
              HigherLife360 Live
            </h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LiveHero />
            </div>

            <div className="flex flex-col gap-4 border border-gold/20 bg-crimson-deep/60 p-6">
              <Button href="/donate" variant="primary" className="justify-center">
                Give During Service
              </Button>
              <Button href="/join" variant="secondary" className="justify-center">
                Connect With Us
              </Button>
              {/* PLACEHOLDER: drop a YouTube/Facebook live chat iframe here once
                  streaming is live, e.g.
                  <iframe src="https://www.youtube.com/live_chat?v=VIDEO_ID&embed_domain=yourdomain.com" />
                  This is intentionally just a labeled slot — no custom chat is built. */}
              <div className="flex min-h-[200px] flex-1 items-center justify-center border border-dashed border-gold/30 p-6 text-center">
                <p className="font-sans text-xs uppercase tracking-widest text-cream/70">
                  Live Chat — Coming Soon
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="cream" id="schedule">
        <Container>
          <SectionTitle eyebrow="Join Us" title="Service Times" />
          <div className="mx-auto mt-14 max-w-xl divide-y divide-ink/10 border border-ink/10">
            {scheduleDays.map(([day, times]) => (
              <div key={day} className="flex items-center justify-between px-6 py-4">
                <span className="font-sans text-sm text-ink/70">{WEEKDAY_LABELS[day]}</span>
                <span className="font-display text-h4 font-semibold text-ink">
                  {times.join(' & ')}
                </span>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-xl text-center text-sm text-ink/70">
            Times shown in IST. Find your local branch&apos;s service times on our{' '}
            <Link
              href="/branches"
              className="font-semibold text-crimson underline-offset-4 hover:underline"
            >
              Branches page →
            </Link>
          </p>
        </Container>
      </Section>

      <section className="bg-gold py-14 text-center">
        <Container>
          <p className="font-display text-h3 font-semibold text-crimson-deep">
            Missed the service? Catch every message anytime.
          </p>
          <div className="mt-6">
            <Button href="/recording" variant="inverse">
              Watch Recordings
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
