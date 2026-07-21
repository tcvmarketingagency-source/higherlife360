'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';
import { MobileNavDrawer } from './MobileNavDrawer';
import { HeaderCrest } from './HeaderCrest';

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(!isHome);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-gold/50 bg-navy/95 backdrop-blur'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div
        className={cn(
          'hidden overflow-hidden text-center transition-all duration-300 lg:block',
          scrolled ? 'max-h-0 opacity-0' : 'max-h-10 border-b border-cream/10 py-2 opacity-100'
        )}
      >
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-cream/70">
          Sundays 9AM &amp; 11AM
        </p>
      </div>

      {/* `xl` (not `lg`/`md`) is deliberate — with 6 top-level items plus
          the header crest, the inline nav needs real room (crest + logo +
          6 links + 2 buttons) that `lg` (1024px) doesn't reliably have:
          measuring the actual rendered header found it already overflows
          by ~38px at exactly 1024px on its own, before the crest is even
          added. Below `xl`, the hamburger drawer takes over instead of a
          cramped/wrapping inline nav — MobileNavDrawer.tsx's own `xl:hidden`
          must stay matched to this breakpoint. */}
      <Container className="flex h-20 items-center justify-between gap-4">
        <div className="flex flex-shrink-0 items-center gap-2">
          {/* CSS-animated, not a second WebGL canvas — this sits on every
              page for as long as it's open, unlike the homepage's old
              few-seconds-long 3D reveal (since removed), so a persistent
              R3F/Three.js context here would be a standing GPU/battery
              cost site-wide for a tiny decorative icon. See HeaderCrest.tsx
              for the full reasoning. Shown at every breakpoint, including
              mobile — only its own size scales down, never hidden. */}
          <HeaderCrest />
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-wide text-cream lg:text-2xl"
          >
            HigherLife<span className="text-gold">360</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-5 xl:flex">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="flex items-center gap-1 whitespace-nowrap font-sans text-xs uppercase tracking-[0.1em] text-cream/80 transition-colors hover:text-gold"
                >
                  {link.label}
                  <span aria-hidden className="text-[10px]">
                    &#9662;
                  </span>
                </button>
                <div className="invisible absolute left-0 top-full w-40 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="border border-gold/20 bg-navy py-2 shadow-xl">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block whitespace-nowrap px-4 py-2 font-sans text-sm text-cream/80 transition-colors hover:bg-gold/10 hover:text-gold"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap font-sans text-xs uppercase tracking-[0.1em] text-cream/80 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="hidden xl:block">
            <Button href="/donate" variant="primary">
              Give
            </Button>
          </div>
          {/* Below `xl` this button previously stayed in the header row
              (as a short "Visit" label) alongside the logo and hamburger,
              but neither the logo nor this group has room to shrink —
              at 320px their combined width overflows the viewport. Hidden
              here since "Plan Your Visit" is already one tap away in the
              drawer footer (MobileNavDrawer.tsx). */}
          <div className="hidden xl:block">
            <Button href="/#visit" variant="secondary">
              Plan Your Visit
            </Button>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center gap-1.5 xl:hidden"
          >
            <span className="h-px w-6 bg-cream" />
            <span className="h-px w-6 bg-cream" />
            <span className="h-px w-6 bg-cream" />
          </button>
        </div>
      </Container>

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} navLinks={navLinks} />
    </header>
  );
}
