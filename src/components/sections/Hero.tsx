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
// actually has. This box carries no bg-*/border/ring of its own — only
// `bg-navy` on the section behind it — so there is nothing here that can
// render as a visible rectangle behind the crest; any hard-edged box
// around the emblem is baked into the source image's own pixels, not
// something this component is drawing.
export function Hero({ image }: { image?: string }) {
  const crestImage = image ?? UNSPLASH_HERO_CROSS_AURORA;

  return (
    <section className="relative flex h-[100svh] flex-col overflow-hidden bg-navy">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 32%, rgba(242,184,94,0.2), transparent 62%)',
        }}
      />

      {/* pt-24/28/36 is a deliberate floor, not vertical-centering slack —
          it guarantees the crest always clears the fixed Header (80px on
          mobile/tablet; ~120px on lg+ in its unscrolled, homepage-top
          state with the "Sundays 9AM & 11AM" bar still showing), no matter
          how large the crest itself gets. justify-center still centers the
          crest+text block within whatever space remains below that floor. */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-6 pb-6 pt-24 text-center sm:gap-6 sm:pb-8 sm:pt-28 lg:pt-36">
        {/* Crest — sized to read as a confident focal point, not a small
            floating icon. aspect-square matches the actual current asset
            (500x500) and the crest artwork's own natural badge shape, so
            object-contain has no letterboxing to hide — the full box is
            the emblem. */}
        <div className="relative w-[52vw] max-w-[230px] aspect-square sm:w-[280px] sm:max-w-none lg:w-[340px] xl:w-[400px] 2xl:w-[440px]">
          <Image
            src={crestImage}
            alt=""
            fill
            priority
            sizes="(min-width: 1536px) 440px, (min-width: 1280px) 400px, (min-width: 1024px) 340px, (min-width: 640px) 280px, 52vw"
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
