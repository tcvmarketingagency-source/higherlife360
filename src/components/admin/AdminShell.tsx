'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SignOutButton } from './SignOutButton';
import { ToastProvider } from './ToastProvider';
import type { AdminRecord } from '@/lib/admin-auth';

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/sermons', label: 'Sermons' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/media', label: 'Media Library' },
  { href: '/admin/site-images', label: 'Site Images' },
];

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({ admin, onNavigate }: { admin: AdminRecord; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 py-8">
        <p className="font-display text-xl font-semibold text-cream">
          HigherLife<span className="text-gold">360</span>
        </p>
        <p className="mt-1 text-eyebrow font-semibold uppercase text-accent">Admin</p>
      </div>
      <nav className="flex-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'block px-3 py-2.5 font-sans text-sm uppercase tracking-widest transition-colors',
              isActive(pathname, item.href)
                ? 'bg-navy-elevated text-gold'
                : 'text-cream/70 hover:bg-navy-elevated hover:text-cream'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-gold/10 px-6 py-6">
        <p className="truncate text-sm text-cream">{admin.name ?? admin.email}</p>
        <p className="truncate text-xs text-cream/60">{admin.email}</p>
        <div className="mt-3">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ admin, children }: { admin: AdminRecord; children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream lg:flex">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 flex-shrink-0 bg-navy lg:block">
          <div className="fixed h-screen w-64">
            <SidebarContent admin={admin} />
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-navy px-4 py-4 lg:hidden">
          <p className="font-display text-lg font-semibold text-cream">
            HigherLife<span className="text-gold">360</span> <span className="text-cream/60">Admin</span>
          </p>
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5"
          >
            <span className="h-px w-6 bg-cream" />
            <span className="h-px w-6 bg-cream" />
            <span className="h-px w-6 bg-cream" />
          </button>
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <>
            <div
              aria-hidden
              className="fixed inset-0 z-40 bg-ink/70 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Admin menu"
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-navy lg:hidden"
            >
              <div className="flex justify-end px-4 pt-4">
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setDrawerOpen(false)}
                  className="text-2xl text-cream"
                >
                  &times;
                </button>
              </div>
              <SidebarContent admin={admin} onNavigate={() => setDrawerOpen(false)} />
            </div>
          </>
        )}

        <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </ToastProvider>
  );
}
