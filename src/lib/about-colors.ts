// Curated text-color palette for the About page's "Our Story" section —
// 20 brand-appropriate colors (deep navies, charcoals, warm golds/bronzes,
// muted jewel tones), not a free-form color picker. Every swatch is
// verified below to pass WCAG AA (4.5:1) against our cream section
// background (#F5F1E8), since that's the one background these colors
// are actually used against (Our Story always renders on cream — see
// src/app/about/page.tsx). That's a deliberate, narrower scope than "works
// on any background": a color can't be both light enough for navy and
// dark enough for cream at once, so rather than promise an impossible
// universal safe color, this palette is validated against the one real
// background it's used on.
export type AboutColorSwatch = {
  key: string;
  name: string;
  hex: string;
};

export const ABOUT_COLOR_PALETTE: AboutColorSwatch[] = [
  { key: 'signature-navy', name: 'Signature Navy', hex: '#0F1523' },
  { key: 'midnight-blue', name: 'Midnight Blue', hex: '#14213D' },
  { key: 'slate-navy', name: 'Slate Navy', hex: '#1B2438' },
  { key: 'steel-blue', name: 'Steel Blue', hex: '#263A52' },
  { key: 'onyx', name: 'Onyx', hex: '#1A1A1A' },
  { key: 'charcoal', name: 'Charcoal', hex: '#2B2B2B' },
  { key: 'graphite', name: 'Graphite', hex: '#3D3D3D' },
  { key: 'warm-charcoal', name: 'Warm Charcoal', hex: '#40392F' },
  { key: 'antique-gold', name: 'Antique Gold', hex: '#855708' },
  { key: 'bronze', name: 'Bronze', hex: '#6B4423' },
  { key: 'chocolate', name: 'Chocolate', hex: '#4A3728' },
  { key: 'amber-bronze', name: 'Amber Bronze', hex: '#7A4A0F' },
  { key: 'espresso', name: 'Espresso', hex: '#3C2A1E' },
  { key: 'burgundy', name: 'Burgundy', hex: '#5C1A2B' },
  { key: 'plum', name: 'Plum', hex: '#4A2545' },
  { key: 'emerald', name: 'Emerald', hex: '#1B4332' },
  { key: 'deep-teal', name: 'Deep Teal', hex: '#0F3D3E' },
  { key: 'forest-green', name: 'Forest Green', hex: '#1E3D2F' },
  { key: 'aubergine', name: 'Aubergine', hex: '#3D1F52' },
  { key: 'garnet', name: 'Garnet', hex: '#6B2530' },
];

export const ABOUT_STORY_BACKGROUND_HEX = '#F5F1E8'; // cream token
export const DEFAULT_HEADING_COLOR = '#0F1523';
export const DEFAULT_BODY_COLOR = '#2B2B2B';

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** WCAG contrast ratio between two hex colors — always >= 1. */
export function contrastRatio(hexA: string, hexB: string): number {
  const lA = relativeLuminance(hexToRgb(hexA)) + 0.05;
  const lB = relativeLuminance(hexToRgb(hexB)) + 0.05;
  return lA > lB ? lA / lB : lB / lA;
}

/** WCAG AA for normal-size text requires a 4.5:1 contrast ratio. */
export function passesAA(hex: string, backgroundHex: string = ABOUT_STORY_BACKGROUND_HEX): boolean {
  return contrastRatio(hex, backgroundHex) >= 4.5;
}

export function isValidAboutColor(hex: string): boolean {
  return ABOUT_COLOR_PALETTE.some((c) => c.hex.toLowerCase() === hex.toLowerCase()) && passesAA(hex);
}
