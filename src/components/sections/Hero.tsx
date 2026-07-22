import Image from 'next/image';
import { UNSPLASH_HERO_CROSS_AURORA } from '@/lib/unsplash-placeholders';

// The homepage's first screen: the church's crest, then its name and
// tagline underneath it, nothing overlapping. Deliberately a plain static
// section (no scroll-pin/cross-fade) — it's one image and two lines, not a
// multi-chapter sequence, so none of that machinery is needed here. The
// scroll-scrubbed photo tour (formerly this same section's chapter 1)
// continues right below in CinematicHero, now starting from "Encounter
// God."
//
// The crest renders via `object-contain` inside an aspect-locked box,
// never `object-cover` — this is the actual fix for the reported bug
// (the crown getting cropped off on desktop): object-cover fills its box
// by cropping whatever doesn't fit, which is fine for a wide landscape
// photo but actively wrong for a badge-shaped image where EVERY edge
// matters. object-contain guarantees the full image is always visible,
// letterboxed if the container's aspect ratio doesn't exactly match the
// source's, regardless of what aspect ratio the admin's uploaded file
// actually has.
export function Hero({ image }: { image?: string }) {
  const crestImage = image ?? UNSPLASH_HERO_CROSS_AURORA;

  return (
    <section className="relative flex h-[100svh] flex-col overflow-hidden bg-navy">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 34%, rgba(242,184,94,0.16), transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center sm:gap-8">
        {/* Crest — sized to feel like a deliberate emblem, not a full-bleed
            photo. aspect-[277/299] is a fixed, viewport-friendly frame
            (not tied to any one upload's exact proportions) that keeps the
            hero's total height predictable regardless of what the admin
            uploads next; object-contain fits whatever image is in that
            frame in full, never cropped. A badge-shaped image fills it
            almost edge to edge, a tall portrait image (the current asset)
            letterboxes left/right — invisible either way since this box has
            no background/border of its own, just the section's bg-navy
            showing through. */}
        <div className="relative aspect-[277/299] w-[42vw] max-w-[170px] sm:w-[220px] sm:max-w-none lg:w-[260px] xl:w-[300px]">
          <Image
            src={crestImage}
            alt=""
            fill
            priority
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 260px, (min-width: 640px) 220px, 42vw"
            className="object-contain"
          />
        </div>

        <div className="max-w-xs sm:max-w-md lg:max-w-2xl">
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
