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
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.25em' }],
        body: ['1.0625rem', { lineHeight: '1.75' }],
        'body-lg': ['1.25rem', { lineHeight: '1.7' }],
        h4: ['1.5rem', { lineHeight: '1.3' }],
        h3: ['2rem', { lineHeight: '1.25' }],
        h2: ['2.75rem', { lineHeight: '1.15' }],
        h1: ['3.5rem', { lineHeight: '1.1' }],
        hero: ['clamp(3rem, 6vw, 5.5rem)', { lineHeight: '1.05' }],
      },
    },
  },
  plugins: [],
};
export default config;
