import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Access Not Granted',
  robots: { index: false, follow: false },
};

// Reached after a successful Google sign-in whose email isn't in
// admin_users — the callback route already signs the session back out
// before redirecting here, so there's nothing left to protect on this
// page itself.
export default function AdminUnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-6 py-16 text-center">
      <div className="max-w-sm">
        <p className="text-eyebrow font-semibold uppercase text-accent">Admin</p>
        <h1 className="mt-4 font-display text-h3 font-semibold text-cream">
          You don&rsquo;t have access
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm text-cream/70">
          That Google account isn&rsquo;t approved for HigherLife360 admin access. If this is a
          mistake, ask whoever manages the admin allowlist to add your email.
        </p>
        <div className="mt-8">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center border border-gold px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-navy"
          >
            Try a Different Account
          </Link>
        </div>
      </div>
    </main>
  );
}
