import type { Metadata } from 'next';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { getAboutPage, getAboutGallery, splitParagraphs } from '@/lib/about-content';
import { getFontPairing } from '@/lib/about-fonts';
import { UNSPLASH_HERO_CHURCH_INTERIOR } from '@/lib/unsplash-placeholders';
import founderPortraitPlaceholder from '@/assets/placeholders/founder-portrait.svg';

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutPage();
  return {
    title: 'About Us',
    description: about.hero_subtitle || 'The story, founder, and family behind HigherLife Fellowship International.',
    openGraph: {
      title: 'About Us | HigherLife360',
      description:
        about.hero_subtitle || 'The story, founder, and family behind HigherLife Fellowship International.',
      images: about.hero_image_url ? [{ url: about.hero_image_url }] : undefined,
    },
  };
}

export default async function AboutPage() {
  const [about, gallery] = await Promise.all([getAboutPage(), getAboutGallery()]);
  const heroImage = about.hero_image_url ?? UNSPLASH_HERO_CHURCH_INTERIOR;
  const founderImage = about.founder_image_url ?? founderPortraitPlaceholder;
  const pairing = getFontPairing(about.font_pairing_key);
  const storyParagraphs = splitParagraphs(about.story_body);
  const founderParagraphs = splitParagraphs(about.founder_message);

  return (
    <main>
      {/* 1. Page hero — same treatment as /donate, /join, /ministries-era
          page heroes: navy base, full-bleed photo at reduced opacity via a
          navy/90 scrim, subtle gold radial glow, centered eyebrow/title/
          subtitle. Kept on the fixed site font-display, not the admin's
          curated font picker — this page needs to still read as
          unmistakably "this site" the moment it loads. */}
      <section className="relative overflow-hidden bg-navy pb-16 pt-40 text-center">
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
            background: 'radial-gradient(circle at 50% 20%, rgba(242,184,94,0.14), transparent 55%)',
          }}
        />
        <Container className="relative">
          <p className="text-eyebrow font-semibold uppercase text-accent [text-shadow:0_1px_10px_rgb(0_0_0_/_60%)]">
            {about.hero_eyebrow}
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-h1 font-semibold text-cream">
            {about.hero_title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-cream/75">{about.hero_subtitle}</p>
        </Container>
      </section>

      {/* 2. Our Story — the only section using the admin's chosen font
          pairing + text colors (see about_page.font_pairing_key/
          heading_color/body_color). Always rendered on cream, which is
          exactly the background the admin's color picker validates
          contrast against (src/lib/about-colors.ts) — so whatever passed
          that gate is guaranteed readable here. */}
      <Section tone="cream" id="story">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow font-semibold uppercase text-accent">{about.story_eyebrow}</p>
            <h2
              style={{ fontFamily: `var(${pairing.headingVar})`, color: about.heading_color }}
              className="text-balance mt-3 text-h2 font-semibold"
            >
              {about.story_title}
            </h2>
            <div className="mx-auto mt-8 max-w-2xl space-y-5 text-left">
              {storyParagraphs.map((paragraph, i) => (
                <p
                  key={i}
                  style={{ fontFamily: `var(${pairing.bodyVar})`, color: about.body_color }}
                  className="text-body leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Founder's message — moved here verbatim from /vision (same
          layout, same fixed ink-on-cream styling as before), now sourced
          from about_page instead of being hardcoded, so the admin can
          edit the text without a code change. */}
      <Section tone="cream" id="founder">
        <Container>
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border-2 border-gold">
              <Image
                src={founderImage}
                alt="Portrait of Pastor Sushil, Founder & Lead Pastor"
                fill
                sizes="(min-width: 768px) 400px, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-eyebrow font-semibold uppercase text-accent">{about.founder_eyebrow}</p>
              <h2 className="mt-3 font-display text-h2 font-semibold text-ink">{about.founder_title}</h2>
              <div className="mt-6 space-y-4 text-body text-ink/80">
                {founderParagraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              <p className="mt-6 font-display text-h4 italic text-navy-elevated">
                {about.founder_signature}
              </p>
              <div className="mt-6">
                <Button href={about.founder_cta_url} variant="outline">
                  {about.founder_cta_label}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Photo gallery */}
      <Section tone="navy" id="gallery">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow font-semibold uppercase text-accent">{about.gallery_eyebrow}</p>
            <h2 className="mt-3 font-display text-h2 font-semibold text-cream">{about.gallery_title}</h2>
            {about.gallery_subtitle && (
              <p className="mx-auto mt-5 max-w-xl text-body text-cream/75">{about.gallery_subtitle}</p>
            )}
          </div>

          {gallery.length > 0 ? (
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {gallery.map((photo, i) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden border border-cream/10 transition-all duration-300 hover:border-gold"
                >
                  <Image
                    src={photo.image_url}
                    alt={photo.alt_text || 'HigherLife church photo'}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                    priority={i < 4}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mx-auto mt-14 max-w-md text-center text-body text-cream/70">
              Photos from across the HigherLife family are on their way — check back soon.
            </p>
          )}
        </Container>
      </Section>
    </main>
  );
}
