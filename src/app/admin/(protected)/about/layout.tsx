import { aboutFontVariables } from '@/lib/about-fonts-loader';

// Same self-hosted font files as the public /about page (see
// src/lib/about-fonts-loader.ts), loaded again here so the admin's font
// picker can render a genuine live preview in each option's real
// typeface — scoped to just this one admin route, not the whole /admin
// section, so no other admin page pays for these fonts either.
export default function AdminAboutLayout({ children }: { children: React.ReactNode }) {
  return <div className={aboutFontVariables}>{children}</div>;
}
