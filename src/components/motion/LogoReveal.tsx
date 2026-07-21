'use client';

import { Component, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { LogoRevealCanvas } from '@/components/three/LogoRevealCanvas';
import { TOTAL_REVEAL_DURATION_S, DISSOLVE_DURATION_S } from '@/lib/logo-reveal-timing';

const SEEN_KEY = 'hl360-logo-reveal-seen';
// Hard cap on how long the overlay can hold the screen, independent of
// whether the 3D scene ever calls back — this is what guarantees the hero
// always shows even if the reveal's own animation or its lazy-loaded bundle
// never resolves. Tracks TOTAL_REVEAL_DURATION_S automatically (plus a
// margin) so it can never end up shorter than the reveal it's meant to
// backstop.
const MAX_DURATION_MS = (TOTAL_REVEAL_DURATION_S + 0.5) * 1000;
const SKIP_FADE_S = 0.2;
const SETTLE_FADE_S = DISSOLVE_DURATION_S;

// Catches any failure in the lazy-loaded 3D subtree (bad texture load,
// WebGL unavailable, chunk load failure) and treats it exactly like a skip,
// so a broken reveal can never leave the hero hidden behind a dead overlay.
class RevealErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export function LogoReveal() {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alreadySeen = window.sessionStorage.getItem(SEEN_KEY) === '1';
    if (reducedMotion || alreadySeen) return;

    // Marked as seen immediately (not on completion) so a skip, a tab
    // switch mid-animation, or navigating away and back within the same
    // session never replays it.
    window.sessionStorage.setItem(SEEN_KEY, '1');
    setShouldPlay(true);
    setVisible(true);
  }, []);

  const finish = useCallback((fast: boolean) => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const el = overlayRef.current;
    if (!el) {
      setVisible(false);
      return;
    }

    gsap.to(el, {
      autoAlpha: 0,
      duration: fast ? SKIP_FADE_S : SETTLE_FADE_S,
      ease: 'power1.out',
      onComplete: () => setVisible(false),
    });
  }, []);

  useEffect(() => {
    if (!shouldPlay) return undefined;

    const safety = window.setTimeout(() => finish(true), MAX_DURATION_MS);
    const skip = () => finish(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish(true);
    };

    window.addEventListener('pointerdown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchstart', skip, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(safety);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [shouldPlay, finish]);

  if (!shouldPlay || !visible) return null;

  return (
    <div
      ref={overlayRef}
      role="presentation"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-navy"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(242,184,94,0.22), transparent 62%)',
        }}
      />
      <div className="relative h-[42vh] w-[42vh] max-h-[300px] max-w-[300px] sm:h-[52vh] sm:w-[52vh] sm:max-h-[420px] sm:max-w-[420px]">
        <RevealErrorBoundary onError={() => finish(true)}>
          <LogoRevealCanvas onSettled={() => finish(false)} />
        </RevealErrorBoundary>
      </div>
      <button
        type="button"
        onClick={() => finish(true)}
        className="absolute bottom-8 right-8 text-xs font-semibold uppercase tracking-[0.28em] text-cream/50 transition-colors hover:text-gold focus-visible:text-gold"
      >
        Skip
      </button>
    </div>
  );
}
