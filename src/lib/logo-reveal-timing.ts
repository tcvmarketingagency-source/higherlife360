// Single source of truth for the homepage 3D logo reveal's timing. Tune the
// two constants below to change how long the reveal plays and how many
// turns the crest makes — everything else (the rotation-phase length, the
// safety timeout in LogoReveal.tsx) derives from these so they can't drift
// out of sync with each other.
//
// Kept dependency-free (no three.js/gsap imports) so pulling this into
// LogoReveal.tsx never drags the lazy-loaded 3D bundle in with it.

// Total time the crest holds the screen end-to-end: entrance, rotation,
// settle, and the final cross-fade into the hero.
export const TOTAL_REVEAL_DURATION_S = 4.5;

// Full 360° Y-axis turns across the rotation phase. Fractional values are
// fine (e.g. 1.5 for one and a half turns).
export const ROTATION_TURNS = 2;

// How long the entrance (scale + rise) takes, and how long the final
// cross-fade into the hero takes — both fixed regardless of the two knobs
// above; the rotation phase gets whatever time is left over.
export const ENTRANCE_DURATION_S = 0.7;
export const DISSOLVE_DURATION_S = 0.45;
