// Single source of truth for the crest logo used in the homepage's 3D logo
// reveal (see components/motion/LogoReveal.tsx and
// components/three/LogoRevealScene.tsx). Points at the client's real
// artwork — to swap it again, replace the file at public/brand/crest-logo.png
// (same filename) with no other code changes. If the client sends an SVG
// instead, save it as public/brand/crest-logo.svg and update this one path
// to match.
//
// The current file was cropped tight to the artwork's alpha bounds (from a
// 499x500 source with ~50% wasted transparent padding down to 277x299) —
// do the same for any replacement so the crest isn't rendered small with a
// large empty margin on the medallion.
//
// Specs to request from the client for the final asset:
// - Transparent background (required).
// - PNG-24 with alpha preferred over SVG for this specific use — the 3D
//   scene uploads it as a GPU texture either way (textures are always
//   raster), and a PNG sidesteps inconsistent browser SVG-rasterization
//   behavior when used as a WebGL texture source. An SVG is still fine if
//   that's all that's available.
// - At least 1500-2000px on the longer edge, cropped tight to the artwork
//   (minimal transparent padding), so it stays crisp on high-DPI screens
//   and at larger presentation sizes than the current reveal uses.
// - Gold linework only — no red (or any other) background baked in, and no
//   pre-baked drop shadow — the 3D scene supplies its own lighting.
export const CREST_LOGO_SRC = '/brand/crest-logo.png';
