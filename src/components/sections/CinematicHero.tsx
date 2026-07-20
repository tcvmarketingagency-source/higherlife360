'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { HeroParticlesCanvas } from '@/components/three/HeroParticlesCanvas';
import { NextServiceCountdown } from '@/components/sections/NextServiceCountdown';
import {
  UNSPLASH_HERO_CROSS_AURORA,
  UNSPLASH_HERO_WORSHIP,
  UNSPLASH_HERO_WORSHIP_BAND,
  UNSPLASH_HERO_SMALL_GROUP,
  UNSPLASH_HERO_FELLOWSHIP,
} from '@/lib/unsplash-placeholders';

// ============================================================================
// FUTURE UPGRADE — REAL DRONE / INTERIOR VIDEO CHURCH TOUR
// ----------------------------------------------------------------------------
// This hero currently cross-fades through 5 still Unsplash photos as the user
// scrolls, standing in for a real scroll-scrubbed video "church tour." When
// the client supplies a real drone/interior walkthrough video, replace the
// CHAPTERS image sequence below with a single <video> element and scrub its
// `currentTime` against scroll instead of cross-fading opacity between
// photos. The pin/scrub scaffolding, chapter headlines, and closing CTA in
// this file are built to sit on top of either background unchanged — only
// the layer that renders `chapter.image` needs to change. Recipe:
//
//   const videoRef = useRef<HTMLVideoElement>(null);
//
//   useGSAP(() => {
//     const video = videoRef.current;
//     if (!video) return;
//     const onLoaded = () => {
//       video.pause();
//       gsap.to(video, {
//         currentTime: video.duration,
//         ease: 'none',
//         scrollTrigger: {
//           trigger: wrapperRef.current,
//           start: 'top top',
//           end: 'bottom bottom',
//           scrub: 0.5,
//           pin: viewportRef.current,
//         },
//       });
//     };
//     video.addEventListener('loadedmetadata', onLoaded);
//     return () => video.removeEventListener('loadedmetadata', onLoaded);
//   }, []);
//
//   <video ref={videoRef} src="/videos/church-tour.mp4" muted playsInline
//     preload="auto" className="absolute inset-0 h-full w-full object-cover" />
//
// The chapter headline/CTA cross-fades can stay driven by the *same* master
// scroll progress (0–1 across the pin), whether that progress is scrubbing
// opacity between photos or scrubbing a video's currentTime.
// ============================================================================

type Chapter = {
  image: string;
  eyebrow: string;
  headline: string;
  sub: string;
  /** CSS object-position for the background image — defaults to center.
   * Set per-chapter when a photo's subject isn't centered, so it stays
   * correctly framed as object-cover crops differently at each breakpoint. */
  imagePosition?: string;
};

const CHAPTERS: Chapter[] = [
  {
    image: UNSPLASH_HERO_CROSS_AURORA,
    eyebrow: 'HigherLife360',
    headline: 'Welcome Home.',
    sub: 'A place to encounter God, find true family, and live the life you were made for.',
    // Slight upward bias — the cross sits centered in the frame, but this
    // keeps a bit more headroom above it as extra margin at wide/ultra-wide
    // aspect ratios. See UNSPLASH_CROSS_AURORA's comment for the pixel-level
    // position verification behind this choice.
    imagePosition: 'center 38%',
  },
  {
    image: UNSPLASH_HERO_WORSHIP,
    eyebrow: 'Encounter',
    headline: 'Encounter God.',
    sub: "Step into a presence that changes everything — worship that isn't performance, but invitation.",
  },
  {
    image: UNSPLASH_HERO_WORSHIP_BAND,
    eyebrow: 'Discover',
    headline: 'Discover Purpose.',
    sub: 'You were not made by accident. There is a calling on your life, and it starts here.',
  },
  {
    image: UNSPLASH_HERO_SMALL_GROUP,
    eyebrow: 'Belong',
    headline: 'Find Your Family.',
    sub: "120+ branches. 10+ nations. One family, spanning the globe — and there's a seat for you.",
  },
  {
    image: UNSPLASH_HERO_FELLOWSHIP,
    eyebrow: 'Live',
    headline: 'Live a Higher Life.',
    sub: 'Wherever you are in your story, this is where the next chapter begins.',
  },
];

export function CinematicHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageLayers = useRef<(HTMLDivElement | null)[]>([]);
  const textLayers = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLAnchorElement>(null);
  // null = static single-chapter fallback (reduced-motion, or a
  // matchMedia gate below hasn't matched yet). Otherwise, the chapter
  // indices participating in the current breakpoint's animated,
  // absolutely-stacked sequence — desktop uses all 5, mobile uses a
  // lighter 3-chapter subset (see the two matchMedia branches below).
  const [activeChapters, setActiveChapters] = useState<number[] | null>(null);
  const isAnimated = activeChapters !== null;
  const showChapter = (i: number) => (activeChapters ? activeChapters.includes(i) : i === 0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop / no-reduced-motion: full pinned, scroll-scrubbed chapter sequence.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        setActiveChapters([0, 1, 2, 3, 4]);

        const images = imageLayers.current.filter((el): el is HTMLDivElement => Boolean(el));
        const texts = textLayers.current.filter((el): el is HTMLDivElement => Boolean(el));
        if (!wrapperRef.current || !viewportRef.current || images.length === 0) return;

        gsap.set(images.slice(1), { autoAlpha: 0 });
        gsap.set(texts.slice(1), { autoAlpha: 0, y: 24 });
        gsap.set(ctaRef.current, { autoAlpha: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            pin: viewportRef.current,
            anticipatePin: 1,
          },
        });

        tl.to(scrollCueRef.current, { autoAlpha: 0, duration: 0.3 }, 0);

        CHAPTERS.forEach((_, i) => {
          if (i === 0) return;
          tl.to(images[i - 1], { autoAlpha: 0, scale: 1.18, duration: 1 }, `>-0.1`)
            .fromTo(images[i], { scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 1 }, '<')
            .to(texts[i - 1], { autoAlpha: 0, y: -24, duration: 0.6 }, '<')
            .fromTo(
              texts[i],
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.6 },
              '<+=0.25'
            );
        });

        tl.to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, '>-0.2');

        return () => {
          setActiveChapters(null);
        };
      });

      // Mobile / no-reduced-motion: a lighter, non-pinned tour. GSAP's
      // `pin` (position: fixed, recalculated every scroll tick) is a
      // common source of touch-scroll jank, especially layered under
      // Lenis — so mobile instead relies on CSS `position: sticky`
      // (max-md:sticky on viewportRef below) to keep the imagery on
      // screen for the scrub range, which is native, compositor-driven,
      // and doesn't fight touch scrolling the way a JS-managed pin can.
      // Only 3 of the 5 chapters play (fewer image decodes/paints on
      // typically slower mobile hardware) — the rest never unhide, so
      // next/image's lazy loading never fetches them on this breakpoint.
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        const mobileChapters = [0, 2, 4];
        setActiveChapters(mobileChapters);

        const img = (i: number) => imageLayers.current[i];
        const txt = (i: number) => textLayers.current[i];
        if (!wrapperRef.current || !viewportRef.current || !img(0) || !img(2) || !img(4)) return;

        gsap.set([img(2), img(4)], { autoAlpha: 0 });
        gsap.set([txt(2), txt(4)].filter(Boolean), { autoAlpha: 0, y: 24 });
        gsap.set(ctaRef.current, { autoAlpha: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        });

        tl.to(scrollCueRef.current, { autoAlpha: 0, duration: 0.3 }, 0);

        for (let step = 1; step < mobileChapters.length; step++) {
          const prev = mobileChapters[step - 1];
          const curr = mobileChapters[step];
          tl.to(img(prev), { autoAlpha: 0, scale: 1.12, duration: 1 }, `>-0.1`)
            .fromTo(img(curr), { scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 1 }, '<')
            .to(txt(prev), { autoAlpha: 0, y: -24, duration: 0.5 }, '<')
            .fromTo(
              txt(curr),
              { autoAlpha: 0, y: 24 },
              { autoAlpha: 1, y: 0, duration: 0.5 },
              '<+=0.2'
            );
        }

        tl.to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, '>-0.2');

        return () => {
          setActiveChapters(null);
        };
      });

      return () => mm.revert();
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="relative max-md:h-[220vh] md:h-[500vh]">
      <div
        ref={viewportRef}
        className="relative flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-navy max-md:sticky max-md:top-0"
      >
        {/* Background chapter images — desktop cross-fades between all 5 and
            mobile cross-fades a lighter 3-chapter subset, both via GSAP
            above; with reduced motion (or before a breakpoint has matched)
            only the first, lightest-weight chapter renders as a plain
            static hero background. */}
        {CHAPTERS.map((chapter, i) => (
          <div
            key={chapter.headline}
            ref={(el) => {
              imageLayers.current[i] = el;
            }}
            className={showChapter(i) ? 'absolute inset-0' : 'absolute inset-0 hidden'}
          >
            <Image
              src={chapter.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: chapter.imagePosition ?? 'center' }}
            />
          </div>
        ))}

        {/* Legibility + brand-tint overlay, sits above the photos. The
            middle stop matters most here — chapter text is vertically
            centered in the viewport, so it always sits right at "via",
            regardless of which photo is showing or how the Ken Burns zoom
            has moved it. Keep this stop strong. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/60 to-navy/90"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(242,184,94,0.18), transparent 60%)',
          }}
        />

        {/* Atmospheric gold-dust particles — already dpr-capped at 1.5 and
            reduced-motion aware inside HeroParticles.tsx. */}
        <HeroParticlesCanvas />

        <Container className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
          {CHAPTERS.map((chapter, i) => (
            <div
              key={chapter.headline}
              ref={(el) => {
                textLayers.current[i] = el;
              }}
              className={
                isAnimated
                  ? showChapter(i)
                    ? 'absolute inset-x-0 px-6'
                    : 'absolute inset-x-0 hidden px-6'
                  : i === 0
                    ? 'px-6'
                    : 'absolute inset-x-0 hidden px-6'
              }
            >
              <p className="text-eyebrow font-semibold uppercase text-accent [text-shadow:0_2px_12px_rgb(0_0_0_/_60%)]">
                {chapter.eyebrow}
              </p>
              {i === 0 ? (
                <h1 className="mx-auto mt-4 max-w-4xl font-display text-hero font-semibold text-cream [text-shadow:0_4px_24px_rgb(0_0_0_/_55%)]">
                  {chapter.headline}
                </h1>
              ) : (
                <p className="mx-auto mt-4 max-w-4xl font-display text-hero font-semibold text-cream [text-shadow:0_4px_24px_rgb(0_0_0_/_55%)]">
                  {chapter.headline}
                </p>
              )}
              <p className="mx-auto mt-6 max-w-xl text-body-lg text-cream/80 [text-shadow:0_2px_12px_rgb(0_0_0_/_50%)]">
                {chapter.sub}
              </p>
            </div>
          ))}

          {/* Closing CTA — fades in during the final chapter on both the
              desktop and mobile animated sequences; always visible
              immediately in the static (reduced-motion) fallback. */}
          <div
            ref={ctaRef}
            className={isAnimated ? 'absolute inset-x-0 bottom-24 px-6' : 'mt-10 px-6'}
          >
            <div className="mb-6 flex justify-center">
              <NextServiceCountdown />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Button href="/#visit" variant="primary" showArrow>
                Plan Your Visit
              </Button>
              <Button href="/live" variant="secondary">
                Watch Live
              </Button>
            </div>
            <p className="mt-6 font-sans text-sm text-cream/70">
              New here?{' '}
              <Link
                href="/join"
                className="font-semibold text-gold underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                We&rsquo;d love to meet you.
              </Link>
            </p>
          </div>
        </Container>

        <a
          ref={scrollCueRef}
          href="#visit"
          aria-label="Scroll down"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-cream/60 transition-colors hover:text-gold motion-safe:animate-bounce"
        >
          <span aria-hidden className="text-2xl">
            &#8595;
          </span>
        </a>
      </div>
    </div>
  );
}
