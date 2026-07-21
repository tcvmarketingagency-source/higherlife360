import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { SiteChrome } from '@/components/providers/SiteChrome';
import './globals.css';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// PLACEHOLDER: update NEXT_PUBLIC_SITE_URL (or this fallback) to the real
// production domain once launched — required for OG image/link previews to
// resolve to absolute URLs correctly when shared.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://higherlife360.org'),
  title: {
    default: 'HigherLife360 — Live a Higher Life',
    template: '%s | HigherLife360',
  },
  description:
    'HigherLife360 is a global church family, rooted in Pune, India, with 120+ branches across 10+ nations — helping every person encounter God and live a Higher Life.',
  openGraph: {
    type: 'website',
    siteName: 'HigherLife360',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

// Church/Organization structured data (JSON-LD) — helps Google show rich
// results. PLACEHOLDER: add real `sameAs` social profile URLs once available.
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Church',
  name: 'HigherLife360',
  alternateName: 'HigherLife',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://higherlife360.org',
  foundingDate: '2017',
  description:
    'HigherLife360 is a global church family, rooted in Pune, India, with 120+ branches across 10+ nations — helping every person encounter God and live a Higher Life.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorantGaramond.variable} ${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
