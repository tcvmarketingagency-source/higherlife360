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
import { UNSPLASH_WORSHIP } from '@/lib/unsplash-placeholders';

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
    images: [{ url: UNSPLASH_WORSHIP }],
  },
};

const impactItems = [
  { mark: 'C', title: 'Church Planting', text: 'Funding new branches across nations.' },
  { mark: 'L', title: 'Local Outreach', text: 'Feeding, serving, and loving our communities.' },
  { mark: 'G', title: 'Global Missions', text: 'Taking the message to 10+ nations.' },
  { mark: 'W', title: 'Weekly Ministry', text: 'Worship, kids, and online reach every week.' },
];

export default function DonatePage() {
  return (
    <main>
      {/* Emotional hero */}
      <section className="relative overflow-hidden bg-crimson-deep pb-16 pt-40 text-center">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 worship
            photo. Verified free (non-Unsplash+) at time of writing. See
            src/lib/unsplash-placeholders.ts for the source. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${UNSPLASH_WORSHIP})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-crimson-deep/85" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 20%, rgba(232,200,120,0.14), transparent 55%)',
          }}
        />
        <Container className="relative">
          <p className="text-eyebrow font-semibold uppercase text-gold">Give</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-h1 font-semibold text-cream">
            Your Generosity Changes Lives.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-cream/75">
            Every gift helps us reach one more person, plant one more branch, and take the message
            of a Higher Life to the nations.
          </p>
        </Container>
      </section>

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
      <Section tone="crimson-deep">
        <Container>
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
            <p className="text-eyebrow font-semibold uppercase text-gold">Give Consistently</p>
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
              className="font-semibold text-crimson underline-offset-4 hover:underline"
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
