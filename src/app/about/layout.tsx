import { aboutFontVariables } from '@/lib/about-fonts-loader';

// Applying the variable class here (not in the root layout) is what scopes
// these self-hosted font files to only the /about route — see
// src/lib/about-fonts-loader.ts for why they're co-located in a shared
// module instead of duplicated here and in the admin preview.
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <div className={aboutFontVariables}>{children}</div>;
}
