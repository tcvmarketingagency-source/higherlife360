import Image from 'next/image';
import { CREST_LOGO_SRC } from '@/lib/brand';

// A small, continuously-turning version of the homepage reveal's gold
// crest, living permanently in the header. Deliberately built with CSS 3D
// transforms (rotateY + backface-visibility) rather than a second R3F/
// Three.js canvas — see Header.tsx's comment on why a persistent WebGL
// context sitewide wasn't the right call here. A compositor-driven CSS
// animation costs effectively nothing once started (no per-frame JS, no
// GPU context to keep alive) versus a canvas rendering continuously for
// as long as any page is open.
//
// Two faces of the SAME image, not one "double-sided" image: rotateY(180deg)
// on its own would show the front face's back MIRRORED (like reading a page
// through the paper). Giving the back face its own extra 180° turn cancels
// that mirroring — the same technique the 3D reveal's medallion uses (see
// LogoRevealScene.tsx's CrestEmblem for the fuller geometric explanation) —
// so both faces read correctly as it turns, not flipped.
//
// Hidden below `xl` (1280px), not just on phones: Header.tsx's own comment
// already flags that the full inline nav (6 links + 2 buttons) has no slack
// at the `lg` (1024px) breakpoint it deliberately switches on at — measuring
// the real header confirmed it's already a hair tight right at 1024px on
// its own, and adding this even at its smallest size pushes real overflow
// out to ~1100px. `xl` was chosen (not a custom in-between value) because
// it's comfortably clear of that measured danger zone with margin to
// spare, while phones/tablets/small laptops (which route through the
// hamburger drawer below `lg` anyway, with only the wordmark and hamburger
// button competing for space) never show it at all — simplest single rule
// that's verified safe everywhere it's visible.
export function HeaderCrest() {
  return (
    <div aria-hidden className="hidden h-7 w-7 flex-shrink-0 xl:block" style={{ perspective: 300 }}>
      <div
        className="relative h-full w-full motion-safe:animate-crest-spin"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          <Image src={CREST_LOGO_SRC} alt="" fill sizes="28px" className="object-contain" />
        </div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Image src={CREST_LOGO_SRC} alt="" fill sizes="28px" className="object-contain" />
        </div>
      </div>
    </div>
  );
}
