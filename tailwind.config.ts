import type { Config } from 'tailwindcss';

// Reads a color from the "R G B" CSS custom properties defined in
// globals.css's :root — that file is the single source of truth for the
// palette's actual hex values. This indirection is what lets Tailwind's
// opacity modifiers (e.g. `text-cream/70`, `bg-gold/10`) keep working while
// still only defining each color once.
function withOpacity(varName: string) {
  return ({ opacityValue }: { opacityValue?: string }) =>
    opacityValue !== undefined ? `rgb(var(${varName}) / ${opacityValue})` : `rgb(var(${varName}))`;
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Tailwind's own runtime resolves function-valued colors (its
      // documented pattern for opacity-modifier support), but the shipped
      // `Config` type only models string values for `colors` — so this block
      // is intentionally cast past that gap rather than losing type-checking
      // on the rest of the config.
      colors: {
        // Strict 3-color system — navy (primary base), cream (secondary
        // base), gold (sole accent) — plus derived shades. See globals.css's
        // :root block for the hex values and the AA contrast pairings each
        // shade was chosen to satisfy.
        navy: {
          DEFAULT: withOpacity('--color-navy'),
          elevated: withOpacity('--color-navy-elevated'),
        },
        cream: {
          DEFAULT: withOpacity('--color-cream'),
          card: withOpacity('--color-cream-card'),
        },
        gold: {
          DEFAULT: withOpacity('--color-gold'),
          light: withOpacity('--color-gold-light'),
          deep: withOpacity('--color-gold-deep'),
        },
        white: withOpacity('--color-white'),
        muted: withOpacity('--color-muted'),
        ink: withOpacity('--color-ink'),
        slate: withOpacity('--color-slate'),
        // Resolves to `gold` on dark sections and `gold-deep` on light
        // sections automatically — see globals.css's [data-tone] rules.
        // Use this (not `gold`) for eyebrow labels, dividers, and inline
        // links/icons that sit directly on a Section's own background.
        accent: withOpacity('--color-accent'),
      } as unknown as Record<string, string>,
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Fluid type scale — each size is a clamp() computed from a mobile
      // floor at a 320px viewport up to the previous fixed desktop value at
      // 1440px (hero: 375px-1500px, to preserve its existing 6.5rem ceiling
      // while giving it a real mobile floor instead of scaling by vw alone).
      // Formula: slope = (max-min)/(maxVW-minVW), same approach as the
      // pre-existing `hero` clamp this scale is modeled on.
      fontSize: {
        eyebrow: [
          'clamp(0.75rem, 0.7321rem + 0.09vw, 0.8125rem)',
          { lineHeight: '1.4', letterSpacing: '0.28em' },
        ],
        body: ['clamp(1rem, 0.9821rem + 0.09vw, 1.0625rem)', { lineHeight: '1.75' }],
        'body-lg': ['clamp(1.125rem, 1.0893rem + 0.18vw, 1.25rem)', { lineHeight: '1.7' }],
        h4: ['clamp(1.25rem, 1.1786rem + 0.36vw, 1.5rem)', { lineHeight: '1.3' }],
        h3: [
          'clamp(1.625rem, 1.4821rem + 0.71vw, 2.125rem)',
          { lineHeight: '1.2', letterSpacing: '-0.01em' },
        ],
        // h1/h2/hero bumped for a more dramatic, editorial scale — h3/h4 left
        // untouched since they're used inside fixed-size cards sitewide.
        h2: [
          'clamp(2rem, 1.6429rem + 1.79vw, 3.25rem)',
          { lineHeight: '1.08', letterSpacing: '-0.015em' },
        ],
        h1: [
          'clamp(2.25rem, 1.75rem + 2.5vw, 4rem)',
          { lineHeight: '1.03', letterSpacing: '-0.02em' },
        ],
        hero: [
          'clamp(2.625rem, 1.3333rem + 5.51vw, 6.5rem)',
          { lineHeight: '1.02', letterSpacing: '-0.02em' },
        ],
      },
    },
  },
  plugins: [],
};
export default config;
