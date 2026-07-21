import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { DonationForm } from '@/components/sections/DonationForm';
import { CopyableField } from '@/components/sections/CopyableField';
import { QrPlaceholder } from '@/components/sections/QrPlaceholder';
import { FaqAccordion } from '@/components/sections/FaqAccordion';
import { UNSPLASH_HERO_FAMILY_PEWS, UNSPLASH_PRAYER } from '@/lib/unsplash-placeholders';
import { getSiteImageMap } from '@/lib/site-images';

const StaggerReveal = dynamic(() =>
  import('@/components/motion/StaggerReveal').then((mod) => mod.StaggerReveal)
);

export const metadata: Metadata = {
  title: 'Give',
  description:
    'Your generosity changes lives. Give a one-time or recurring gift to help HigherLife360 reach one more person, plant one more branch, and take a Higher Life to the nations.',
  openGraph: {
    title: 'Give | HigherLife360',
    description:
      'Every gift helps us reach one more person, plant one more branch, and take the message of a Higher Life to the nations.',
    images: [{ url: UNSPLASH_HERO_FAMILY_PEWS }],
  },
};

const impactItems = [
  {
    mark: 'C',
    title: 'Church Planting',
    text: 'Every new branch starts with a launch team, a venue, and a season of faith before it becomes self-sustaining. Your giving funds that runway — helping a new HigherLife family take root in a city that doesn’t have one yet.',
  },
  {
    mark: 'L',
    title: 'Local Outreach',
    text: 'From food drives to practical help for families in crisis, local outreach is how we love our neighborhoods with more than words. Your gift shows up as a meal served, a hand extended, or a quiet need met.',
  },
  {
    mark: 'G',
    title: 'Global Missions',
    text: 'Beyond our own branches, giving helps carry the message of a Higher Life into nations and communities we haven’t reached yet — the same conviction that started in one small room in Pune, still spreading.',
  },
  {
    mark: 'W',
    title: 'Weekly Ministry',
    text: 'Every Sunday’s worship, every kids’ ministry classroom, and every livestream that reaches someone far from home is made possible by consistent, faithful giving — week in and week out.',
  },
];

export default async function DonatePage() {
  const siteImages = await getSiteImageMap();
  const heroImage = siteImages.donate_hero ?? UNSPLASH_HERO_FAMILY_PEWS;

  return (
    <main>
      {/* Emotional hero */}
      <section className="relative overflow-hidden bg-navy pb-16 pt-40 text-center">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 photo,
            or via /admin/site-images (key: donate_hero). */}
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
            Give
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-h1 font-semibold text-cream">
            Your Generosity Changes Lives.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-cream/75">
            Every gift helps us reach one more person, plant one more branch, and take the message
            of a Higher Life to the nations.
          </p>
        </Container>
      </section>

      {/* Why We Give */}
      <Section tone="cream">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow font-semibold uppercase text-accent">Why We Give</p>
            <h2 className="mt-3 font-display text-h2 font-semibold text-ink">
              Generosity Isn&rsquo;t a Transaction. It&rsquo;s a Way of Life.
            </h2>
            <p className="mt-6 text-body text-ink/80">
              We don&rsquo;t ask you to give because HigherLife360 needs money to survive. We invite
              you to give because generosity is one of the most direct ways we get to reflect the
              heart of God — a God who gave first, gave everything, and never once gave with strings
              attached.
            </p>
            <p className="mt-4 text-body text-ink/80">
              Every gift, whether it&rsquo;s the price of a coffee or a significant offering, is an
              act of worship and trust. It says: I believe this mission is bigger than my bank
              account, and I want to be part of what God is doing — in Pune, and across the 120+
              branches carrying that same mission into 10+ nations.
            </p>
          </div>
        </Container>
      </Section>

      {/* Giving form */}
      <Section tone="cream" id="give-form">
        <Container>
          <div className="mx-auto max-w-xl">
            <DonationForm />

            {/* Trust & security strip */}
            <div className="mt-8 grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
              <p className="font-sans text-xs text-ink/70">
                🔒 Secure &amp; Encrypted (256-bit SSL)
              </p>
              <p className="font-sans text-xs text-ink/70">🧾 Instant Tax Receipt by Email</p>
              <p className="font-sans text-xs text-ink/70">✔️ 100% Goes to the Mission</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Where Your Gift Goes */}
      <Section tone="navy" className="relative overflow-hidden">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 photo.
            See src/lib/unsplash-placeholders.ts for the source. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-fixed bg-center opacity-20"
          style={{ backgroundImage: `url(${UNSPLASH_PRAYER})` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-navy/90 to-navy"
        />
        <Container className="relative">
          <SectionTitle
            eyebrow="Impact"
            title="Where Your Gift Goes"
            subtitle="Every gift is stewarded toward real, lasting impact."
          />
          <StaggerReveal className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {impactItems.map((item) => (
              <div key={item.title} className="border border-gold/20 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/60">
                  <span className="font-display text-lg text-gold">{item.mark}</span>
                </div>
                <h3 className="mt-5 font-display text-h4 font-semibold text-cream">{item.title}</h3>
                <p className="mt-2 text-sm text-cream/70">{item.text}</p>
              </div>
            ))}
          </StaggerReveal>
          <p className="mx-auto mt-14 max-w-lg text-center text-sm uppercase tracking-widest text-gold">
            120+ branches. 230,000+ lives connected. Your gift multiplies.
          </p>
        </Container>
      </Section>

      {/* Recurring giving encouragement */}
      <Section tone="cream">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow font-semibold uppercase text-accent">Give Consistently</p>
            <h2 className="mt-3 font-display text-h2 font-semibold text-ink">
              Give Your First Fruits, Automatically
            </h2>
            <p className="mt-4 text-body text-ink/80">
              Recurring giving is simple, secure, and consistent — set it once, and your generosity
              keeps reaching people every week without a second thought.
            </p>
            <div className="mt-8">
              <Button href="#give-form" variant="outline">
                Set Up Recurring Giving
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Other ways to give */}
      <Section tone="cream" className="pt-0">
        <Container>
          <div className="border-t border-ink/10 pt-14">
            <SectionTitle eyebrow="More Options" title="Other Ways to Give" />
            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              <div className="border border-ink/10 p-8">
                <h3 className="font-display text-h4 font-semibold text-ink">UPI</h3>
                <p className="mt-2 text-sm text-ink/70">Scan or pay directly via UPI.</p>
                <div className="mt-6 flex justify-center">
                  {/* PLACEHOLDER: replace with the real UPI QR code image. */}
                  <QrPlaceholder label="UPI QR" />
                </div>
                <div className="mt-6">
                  {/* PLACEHOLDER: replace with the real UPI ID. */}
                  <CopyableField label="UPI ID" value="give@higherlife360" />
                </div>
              </div>

              <div className="border border-ink/10 p-8">
                <h3 className="font-display text-h4 font-semibold text-ink">Bank Transfer</h3>
                <p className="mt-2 text-sm text-ink/70">Give directly via bank transfer.</p>
                <div className="mt-6 space-y-3">
                  {/* PLACEHOLDER: replace with real bank account details. */}
                  <CopyableField label="Account Name" value="HigherLife360 Church" />
                  <CopyableField label="Account Number" value="000123456789" />
                  <CopyableField label="IFSC / SWIFT" value="HLFE0000123" />
                </div>
              </div>

              <div className="border border-ink/10 p-8">
                <h3 className="font-display text-h4 font-semibold text-ink">In Person</h3>
                <p className="mt-2 text-sm text-ink/70">
                  Give at any HigherLife branch — cash, card, or UPI accepted on-site.
                </p>
                <div className="mt-6">
                  <Button href="/branches" variant="outline">
                    Find a Branch Near You →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Financial trust / accountability */}
      <section className="border-t border-ink/10 bg-cream py-14 text-center">
        <Container>
          <p className="text-sm text-ink/70">
            We steward every gift with integrity and accountability.{' '}
            {/* PLACEHOLDER: link to real financial statements or a finance contact. */}
            <Link
              href="#"
              className="font-semibold text-navy-elevated underline-offset-4 hover:underline"
            >
              View our financial statements →
            </Link>
          </p>
        </Container>
      </section>

      {/* FAQ */}
      <Section tone="cream" className="pt-0">
        <Container>
          <div className="border-t border-ink/10 pt-14">
            <SectionTitle eyebrow="Questions" title="Giving FAQ" />
            <div className="mt-14">
              <FaqAccordion />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
