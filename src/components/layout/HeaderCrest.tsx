import Image from 'next/image';
import { CREST_LOGO_SRC } from '@/lib/brand';

// A small, continuously-turning gold crest living permanently in the
// header. Built with CSS 3D transforms (rotateY + backface-visibility),
// not a second R3F/Three.js canvas — see Header.tsx's comment for why a
// persistent WebGL context sitewide wasn't the right call for something
// this small that runs for as long as any page is open. A compositor-
// driven CSS animation costs effectively nothing once started (no
// per-frame JS, no GPU context to keep alive).
//
// Two faces of the SAME image, not one "double-sided" image: rotateY(180deg)
// on its own would show the front face's back MIRRORED (like reading a page
// through the paper), because rotating the whole assembly is a rigid
// transform — it doesn't re-draw the artwork, it just re-orients the same
// flat image, so the side now facing the viewer is its own reverse. Giving
// the back face its own EXTRA 180° turn (on top of the shared spin) flips
// its UVs back the other way, cancelling that mirroring — the same
// principle as a coin's reverse die being engraved backwards so the
// minted coin reads correctly on both faces.
//
// Visible at every breakpoint (mobile included), scaled up at `sm`/`lg` to
// stay legible without ever outsizing the wordmark — see Header.tsx for how
// the surrounding layout was reworked to fit it in at every width instead
// of hiding it.
export function HeaderCrest() {
  return (
    <div
      aria-hidden
      className="h-9 w-9 flex-shrink-0 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
      style={{ perspective: 300 }}
    >
      <div
        className="relative h-full w-full motion-safe:animate-crest-spin"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }}>
          <Image
            src={CREST_LOGO_SRC}
            alt=""
            fill
            sizes="(min-width: 1024px) 44px, (min-width: 640px) 40px, 36px"
            className="object-contain"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Image
            src={CREST_LOGO_SRC}
            alt=""
            fill
            sizes="(min-width: 1024px) 44px, (min-width: 640px) 40px, 36px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
