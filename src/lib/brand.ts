// Single source of truth for the crest logo used in the header's small,
// continuously-turning navbar icon (see components/layout/HeaderCrest.tsx —
// currently the only consumer; the homepage used to have a full-screen 3D
// reveal of this same crest, but that's been removed). Points at the
// client's real artwork — to swap it again, replace the file at
// public/brand/crest-logo.png (same filename) with no other code changes.
// If the client sends an SVG instead, save it as public/brand/crest-logo.svg
// and update this one path to match.
//
// The current file was cropped tight to the artwork's alpha bounds (from a
// 499x500 source with ~50% wasted transparent padding down to 277x299) —
// do the same for any replacement so the crest isn't rendered small with a
// large empty margin.
//
// Specs to request from the client for the final asset:
// - Transparent background (required).
// - PNG-24 with alpha or SVG are both fine — HeaderCrest renders this as a
//   plain <Image>, not a GPU texture (there's no WebGL involved since the
//   reveal was removed), so neither format has a technical edge here.
// - The current 277x299 source is already comfortably oversampled for the
//   navbar icon's largest on-screen size (44px, ~132px at 3x DPR) — no need
//   to request anything larger unless this asset gets reused somewhere
//   bigger than the header.
// - Gold linework only — no red (or any other) background baked in.
export const CREST_LOGO_SRC = '/brand/crest-logo.png';
