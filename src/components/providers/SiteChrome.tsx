'use client';

import { usePathname } from 'next/navigation';
import { SmoothScroll } from './smooth-scroll';
import { PageTransition } from './PageTransition';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// The admin panel (/admin/**) is a completely separate application shell
// (see src/components/admin/AdminShell.tsx) — it must NOT inherit the
// public site's fixed Header/Footer, Lenis smooth-scroll, or page-transition
// wrapper. Beyond just looking wrong, PageTransition's framer-motion
// wrapper animates via a CSS transform, which creates a new containing
// block for any `position: fixed` descendant — that would silently break
// AdminShell's fixed sidebar, mobile drawer, and toast positioning.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SmoothScroll>
      <Header />
      <PageTransition>{children}</PageTransition>
      <Footer />
    </SmoothScroll>
  );
}
