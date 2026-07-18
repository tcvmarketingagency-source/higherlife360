import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          deep: '#5C0A18',
          DEFAULT: '#7A0C1F',
        },
        gold: {
          DEFAULT: '#C9A24B',
          light: '#E8C878',
        },
        cream: '#F5EFE0',
        ink: '#241512',
        // New luxury dark base (Phase 1: homepage only — see Section.tsx's
        // `tone` prop for the "charcoal"/"charcoal-deep" values that use
        // these). Crimson is being demoted to an accent color; this becomes
        // the primary dark background. Warm near-black, deliberately not a
        // cold/pure black or gray.
        charcoal: {
          deep: '#0F0E0C',
          DEFAULT: '#14110E',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.28em' }],
        body: ['1.0625rem', { lineHeight: '1.75' }],
        'body-lg': ['1.25rem', { lineHeight: '1.7' }],
        h4: ['1.5rem', { lineHeight: '1.3' }],
        h3: ['2.125rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        // h1/h2/hero bumped for a more dramatic, editorial scale — h3/h4 left
        // untouched since they're used inside fixed-size cards sitewide.
        h2: ['3.25rem', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        h1: ['4rem', { lineHeight: '1.03', letterSpacing: '-0.02em' }],
        hero: ['clamp(3.25rem, 7vw, 6.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
};
export default config;
