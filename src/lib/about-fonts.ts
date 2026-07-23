// Curated font pairings for the About page's "Our Story" section — a fixed
// list, not a free-text/Google-Fonts picker. Each pairing bundles a heading
// font and a body font that were chosen to work together, so the admin
// can't accidentally combine two fonts that clash; they just pick one
// named option. The actual font FILES are loaded (self-hosted, via
// next/font/google) in src/app/about/layout.tsx, scoped to only the /about
// route so no other page pays for these fonts' weight. Each entry's
// `headingVar`/`bodyVar` must match the CSS variable name given to that
// font's next/font `variable` option in that layout file exactly, or the
// pairing will silently fall back to the browser default serif/sans.
export type FontPairingKey =
  | 'classic-serif'
  | 'modern-editorial'
  | 'heritage-serif'
  | 'luxury-editorial'
  | 'timeless-elegance';

export type FontPairing = {
  key: FontPairingKey;
  label: string;
  description: string;
  headingVar: string;
  bodyVar: string;
  headingSample: string;
  bodySample: string;
};

export const FONT_PAIRINGS: FontPairing[] = [
  {
    key: 'classic-serif',
    label: 'Classic Serif',
    description: 'Playfair Display + Lora — a timeless editorial pairing with high contrast.',
    headingVar: '--font-about-heading-classic-serif',
    bodyVar: '--font-about-body-classic-serif',
    headingSample: 'How It All Began',
    bodySample: 'A warm, readable serif built for long-form storytelling.',
  },
  {
    key: 'modern-editorial',
    label: 'Modern Editorial',
    description: 'Libre Baskerville + Work Sans — a crisp magazine-style contrast.',
    headingVar: '--font-about-heading-modern-editorial',
    bodyVar: '--font-about-body-modern-editorial',
    headingSample: 'How It All Began',
    bodySample: 'A warm, readable serif built for long-form storytelling.',
  },
  {
    key: 'heritage-serif',
    label: 'Heritage Serif',
    description: 'Cormorant Garamond + EB Garamond — matches the site’s own classic serif identity.',
    // Heading reuses --font-display, the SAME Cormorant Garamond already
    // self-hosted site-wide in the root layout — no extra font file for
    // this, the site's own default pairing, to load.
    headingVar: '--font-display',
    bodyVar: '--font-about-body-heritage-serif',
    headingSample: 'How It All Began',
    bodySample: 'A warm, readable serif built for long-form storytelling.',
  },
  {
    key: 'luxury-editorial',
    label: 'Luxury Editorial',
    description: 'Fraunces + Karla — a soft, boutique display serif with a clean modern body.',
    headingVar: '--font-about-heading-luxury-editorial',
    bodyVar: '--font-about-body-luxury-editorial',
    headingSample: 'How It All Began',
    bodySample: 'A warm, readable serif built for long-form storytelling.',
  },
  {
    key: 'timeless-elegance',
    label: 'Timeless Elegance',
    description: 'Marcellus + Nunito Sans — confident, heritage-brand letterforms.',
    headingVar: '--font-about-heading-timeless-elegance',
    bodyVar: '--font-about-body-timeless-elegance',
    headingSample: 'How It All Began',
    bodySample: 'A warm, readable serif built for long-form storytelling.',
  },
];

export const DEFAULT_FONT_PAIRING_KEY: FontPairingKey = 'heritage-serif';

export function getFontPairing(key: string): FontPairing {
  return FONT_PAIRINGS.find((p) => p.key === key) ?? FONT_PAIRINGS.find((p) => p.key === DEFAULT_FONT_PAIRING_KEY)!;
}
