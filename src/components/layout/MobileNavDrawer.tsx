'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { NavLink } from './nav-links';

export function MobileNavDrawer({
  open,
  onClose,
  navLinks,
}: {
  open: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}) {
  const [watchOpen, setWatchOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-ink/70 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-crimson-deep p-8 md:hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-semibold text-cream">
                HigherLife<span className="text-gold">360</span>
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center text-2xl text-cream"
              >
                &times;
              </button>
            </div>

            <nav className="mt-10 flex flex-1 flex-col gap-1">
              {navLinks.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      type="button"
                      onClick={() => setWatchOpen((prev) => !prev)}
                      aria-expanded={watchOpen}
                      className="flex w-full items-center justify-between border-b border-gold/10 py-3 font-sans text-sm uppercase tracking-[0.15em] text-cream/80"
                    >
                      {link.label}
                      <span
                        aria-hidden
                        className={
                          watchOpen ? 'rotate-180 transition-transform' : 'transition-transform'
                        }
                      >
                        &#9662;
                      </span>
                    </button>
                    {watchOpen && (
                      <div className="flex flex-col gap-1 py-2 pl-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className="py-2 font-sans text-sm text-cream/70 hover:text-gold"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className="border-b border-gold/10 py-3 font-sans text-sm uppercase tracking-[0.15em] text-cream/80 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            <div className="mt-8 flex flex-col gap-3">
              <Button href="/donate" variant="primary" className="justify-center" onClick={onClose}>
                Give
              </Button>
              <Button
                href="/#visit"
                variant="secondary"
                className="justify-center"
                onClick={onClose}
              >
                Plan Your Visit
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
