import {
  Playfair_Display,
  Lora,
  Libre_Baskerville,
  Work_Sans,
  EB_Garamond,
  Fraunces,
  Karla,
  Marcellus,
  Nunito_Sans,
} from 'next/font/google';

// The actual next/font/google calls for every curated About page pairing
// (see src/lib/about-fonts.ts for the pairing list itself), co-located in
// one shared module per Next.js's documented pattern for reusing the same
// self-hosted font in more than one place — here, that's both the public
// /about page (src/app/about/layout.tsx) and the admin's live font
// preview (src/app/admin/(protected)/about/layout.tsx). Each import site
// applies `aboutFontVariables` to a wrapping element, which is what
// actually triggers Next to fetch/preload that font's files — so it's
// still only ever loaded for someone who visits /about or /admin/about,
// never site-wide.
//
// Heritage Serif's heading font (Cormorant Garamond) is deliberately NOT
// loaded here — it reuses --font-display, already self-hosted site-wide
// in the root layout (see src/lib/about-fonts.ts's comment on that entry).
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-about-heading-classic-serif',
  display: 'swap',
});
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-about-body-classic-serif',
  display: 'swap',
});
const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-about-heading-modern-editorial',
  display: 'swap',
});
const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-about-body-modern-editorial',
  display: 'swap',
});
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-about-body-heritage-serif',
  display: 'swap',
});
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-about-heading-luxury-editorial',
  display: 'swap',
});
const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-about-body-luxury-editorial',
  display: 'swap',
});
const marcellus = Marcellus({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-about-heading-timeless-elegance',
  display: 'swap',
});
const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-about-body-timeless-elegance',
  display: 'swap',
});

export const aboutFontVariables = [
  playfairDisplay.variable,
  lora.variable,
  libreBaskerville.variable,
  workSans.variable,
  ebGaramond.variable,
  fraunces.variable,
  karla.variable,
  marcellus.variable,
  nunitoSans.variable,
].join(' ');
