import Image from 'next/image';
import { CREST_LOGO_SRC } from '@/lib/brand';
import { HeroParticlesCanvas } from '@/components/three/HeroParticlesCanvas';

// The homepage's first screen: the church's crest, then its name and
// tagline underneath it, nothing overlapping. Deliberately a plain static
// section (no scroll-pin/cross-fade) — it's one image and two lines, not a
// multi-chapter sequence, so none of that machinery is needed here. The
// scroll-scrubbed photo tour (formerly this same section's chapter 1)
// continues right below in CinematicHero, now starting from "Encounter
// God."
//
// This crest is now the same static file (public/brand/crest-logo.png,
// via lib/brand.ts's CREST_LOGO_SRC) that HeaderCrest.tsx uses for the
// spinning navbar icon — deliberately decoupled from the site_images DB
// row (there is no more per-request Supabase lookup for this image), so
// it can never go stale and never depends on the admin panel's upload
// path. One consequence worth knowing: because it's the SAME file, this
// is also now the source of truth for the navbar crest — replacing this
// file changes both places at once.
//
// The crest renders via `object-contain` inside an aspect-locked box,
// never `object-cover` — this is the actual fix for the original reported
// bug (the crown getting cropped off on desktop): object-cover fills its
// box by cropping whatever doesn't fit, which is fine for a wide
// landscape photo but actively wrong for a badge-shaped image where every
// edge matters. This box carries no bg-*/border/ring of its own — only
// `bg-navy` on the section behind it — so there is nothing here that can
// render as a visible rectangle behind the crest.
//
// Sizing math: the current crest-logo.png is a 500x500 canvas, but the
// artwork's own alpha bounds only fill ~58% of its width and ~63% of its
// height (measured) — the rest is transparent padding, same crop style
// as the file it replaced. Since object-contain scales the WHOLE canvas
// (padding included) to fit this box, the box has to be sized larger than
// the visible-crest target size to compensate — a box height of H
// renders a visible emblem roughly 0.63 * H tall, not H. Every width
// below accounts for that 0.63 factor so the visible crest — not the
// invisible padded box — lands at roughly 30-35% of viewport height on
// desktop, where height (not width) is the natural constraint; on
// portrait mobile/tablet, available width is the tighter constraint, so
// those sizes are picked to look proportionate rather than to hit a
// vh target that would force the crest wider than is sensible for a
// narrow screen.
export function Hero() {
  return (
    <section className="relative flex h-[100svh] flex-col overflow-hidden bg-navy">
      {/* A restrained gold glow behind the crest, not a wash across the
          whole section — 0.2 opacity spreading to 62% previously lifted a
          large enough share of the canvas that the section read as a
          lightened grey rather than a true dark navy. Cut both the
          opacity and the spread so the glow stays a hint centered behind
          the crest, then layered a second, darkening vignette on top that
          deepens toward the edges/corners — bg-navy (the section's own
          background) is what's actually visible almost everywhere now. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(242,184,94,0.09), transparent 42%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Same gold-dust particle field used in CinematicHero below —
          circular soft sprites (never squares — see HeroParticles.tsx's
          canvas-drawn radial-gradient texture), capped at 400 points and
          dpr [1, 1.5], reduced-motion aware, dynamically imported with
          ssr:false so it never blocks this section's initial paint. Sits
          between the background layers above and the z-10 content below
          — pure atmosphere, low enough opacity (0.55 per-particle, over a
          tiny fraction of pixels) that it has no measurable effect on the
          crest/text contrast beneath it. */}
      <HeroParticlesCanvas />

      {/* pt-24/28/36 is a deliberate floor, not vertical-centering slack —
          it guarantees the crest always clears the fixed Header (80px on
          mobile/tablet; ~120px on lg+ in its unscrolled, homepage-top
          state with the "Sundays 9AM & 11AM" bar still showing), no matter
          how large the crest itself gets. justify-center still centers the
          crest+text block within whatever space remains below that floor —
          which is what makes the negative margins below "safe": shrinking
          the group's total height only ever redistributes the freed space
          as extra room above and below (justify-center splits it evenly),
          it never leaves it stranded at one end. */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-24 text-center sm:pb-8 sm:pt-28 lg:pt-32">
        {/* Crest — aspect-square matches the source canvas exactly (not
            just the visible artwork, which is inset within it — see the
            file-level comment above), so object-contain has no letterboxing
            of its own to add on top of the padding already baked into the
            file. */}
        <div className="relative aspect-square w-[68vw] max-w-[218px] min-[375px]:w-[255px] min-[375px]:max-w-none min-[414px]:w-[280px] sm:w-[190px] md:w-[220px] lg:w-[250px] min-[1280px]:w-[300px] min-[1440px]:w-[430px] min-[1920px]:w-[520px]">
          <Image
            src={CREST_LOGO_SRC}
            alt=""
            fill
            priority
            sizes="(min-width: 1920px) 520px, (min-width: 1440px) 430px, (min-width: 1280px) 300px, (min-width: 1024px) 250px, (min-width: 768px) 220px, (min-width: 640px) 190px, (min-width: 414px) 280px, (min-width: 375px) 255px, 68vw"
            className="object-contain"
          />
        </div>

        {/* Negative margin, not `gap` — the crest's own transparent PNG
            padding (see file comment: content fills only ~63% of the
            500x500 canvas, sitting roughly in the middle 15%-82% band
            vertically) means the box's bottom edge already sits ~22% of
            its own height below the visible artwork. A `gap` measures
            from that invisible box edge, not the artwork itself, so it
            reads as a much bigger optical gap than its px value suggests
            — this was the "crest and headline read as disconnected"
            complaint. Pulling the text up by (box-height * 0.218 - ~20px
            target optical gap) cancels that padding out per breakpoint
            (the box is a different size at each one, so this can't be a
            single fixed value) and leaves a small, deliberate ~20px gap
            between the actual visible crest and the headline instead. */}
        <div className="-mt-[28px] max-w-xs min-[375px]:-mt-[36px] min-[414px]:-mt-[41px] sm:-mt-[21px] sm:max-w-md md:-mt-[28px] lg:-mt-[35px] lg:max-w-2xl min-[1280px]:-mt-[45px] min-[1440px]:-mt-[74px] min-[1920px]:-mt-[93px]">
          <h1 className="text-balance font-display text-heroBrand font-semibold tracking-[-0.015em] text-cream [text-shadow:0_4px_28px_rgb(0_0_0_/_45%)]">
            HigherLife Fellowship International
          </h1>
          <p className="text-balance mx-auto mt-3 max-w-md font-display text-lg italic tracking-[0.01em] text-gold [text-shadow:0_2px_16px_rgb(0_0_0_/_40%)] sm:mt-4 sm:text-xl lg:text-2xl">
            There is HigherLife in Christ!
          </p>
        </div>
      </div>

      <a
        href="#tour"
        aria-label="Scroll down"
        className="relative z-10 mx-auto mb-8 text-cream/60 transition-colors hover:text-gold motion-safe:animate-bounce"
      >
        <span aria-hidden className="text-2xl">
          &#8595;
        </span>
      </a>
    </section>
  );
}
