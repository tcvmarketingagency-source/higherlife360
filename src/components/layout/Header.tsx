'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';
import { MobileNavDrawer } from './MobileNavDrawer';

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
          ? 'border-b border-gold/50 bg-crimson-deep/95 backdrop-blur'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <div
        className={cn(
          'hidden overflow-hidden text-center transition-all duration-300 md:block',
          scrolled ? 'max-h-0 opacity-0' : 'max-h-10 border-b border-cream/10 py-2 opacity-100'
        )}
      >
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-cream/70">
          Sundays 9AM &amp; 11AM
        </p>
      </div>

      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-wide text-cream md:text-2xl"
        >
          HigherLife<span className="text-gold">360</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label} className="group relative">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="flex items-center gap-1 font-sans text-sm uppercase tracking-[0.15em] text-cream/80 transition-colors hover:text-gold"
                >
                  {link.label}
                  <span aria-hidden className="text-[10px]">
                    &#9662;
                  </span>
                </button>
                <div className="invisible absolute left-0 top-full w-40 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="border border-gold/20 bg-crimson-deep py-2 shadow-xl">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 font-sans text-sm text-cream/80 transition-colors hover:bg-gold/10 hover:text-gold"
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
                className="font-sans text-sm uppercase tracking-[0.15em] text-cream/80 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button href="/donate" variant="primary">
              Give
            </Button>
          </div>
          <Button href="/#visit" variant="secondary">
            <span className="md:hidden">Visit</span>
            <span className="hidden md:inline">Plan Your Visit</span>
          </Button>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
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
