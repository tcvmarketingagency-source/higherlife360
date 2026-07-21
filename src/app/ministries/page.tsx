import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { MinistriesShowcase } from '@/components/sections/MinistriesShowcase';
import { ministries } from '@/lib/ministries-data';
import { UNSPLASH_HERO_FELLOWSHIP } from '@/lib/unsplash-placeholders';
import { getSiteImageMap } from '@/lib/site-images';

export const metadata: Metadata = {
  title: 'Ministries',
  description:
    'From HigherLife Kids to Missions & Outreach — find the ministry that fits your season at HigherLife360.',
  openGraph: {
    title: 'Ministries | HigherLife360',
    description:
      'From HigherLife Kids to Missions & Outreach — find the ministry that fits your season at HigherLife360.',
  },
};

export default async function MinistriesPage() {
  const siteImages = await getSiteImageMap();
  const heroImage = siteImages.ministries_hero ?? UNSPLASH_HERO_FELLOWSHIP;
  const resolvedMinistries = ministries.map((ministry) => ({
    ...ministry,
    image: siteImages[`ministry_${ministry.slug.replace(/-/g, '_')}`] ?? ministry.image,
  }));

  return (
    <main>
      <section className="relative overflow-hidden bg-navy pb-16 pt-40 text-center">
        {/* TEMPORARY STOCK PHOTO — replace with a real HigherLife360 photo,
            or via /admin/site-images (key: ministries_hero). */}
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
            Get Connected
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-h1 font-semibold text-cream">
            A Place for Every Season of Life
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-cream/75">
            Whether you&rsquo;re 6 or 60, single or raising a family, brand new to faith or leading
            a team — there&rsquo;s a ministry here built for exactly where you are, not where
            you&rsquo;re supposed to be.
          </p>
        </Container>
      </section>

      <Section tone="cream">
        <Container>
          <SectionTitle
            eyebrow="Find Your Place"
            title="Every Ministry Has One Goal:"
            titleAccent="Helping You Grow"
            subtitle="Ministry here isn’t about filling a program — it’s about surrounding you with the right people for whatever season you’re in. Explore what’s below, and take the next step that fits."
          />
          <div className="mt-16">
            <MinistriesShowcase items={resolvedMinistries} />
          </div>
        </Container>
      </Section>

      <section className="bg-gold py-16 text-center">
        <Container>
          <p className="font-display text-h3 font-semibold text-navy">
            Not Sure Where to Start?
          </p>
          <p className="mx-auto mt-4 max-w-xl text-body text-navy">
            Fill out a Connect Card and tell us a little about yourself — we&rsquo;ll help point you
            toward the right ministry, no guesswork required.
          </p>
          <div className="mt-8">
            <Button href="/join#connect-card" variant="inverse" showArrow>
              Get Connected
            </Button>
          </div>
        </Container>
      </section>
    </main>
  );
}
