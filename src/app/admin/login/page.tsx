import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SignInButton } from './SignInButton';

export const metadata: Metadata = {
  title: 'Admin Sign In',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    const { data: adminRecord } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', user.email)
      .maybeSingle();
    if (adminRecord) redirect('/admin');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-6 py-16">
      <div className="w-full max-w-sm text-center">
        <p className="font-display text-2xl font-semibold text-cream">
          HigherLife<span className="text-gold">360</span>
        </p>
        <p className="mt-1 text-eyebrow font-semibold uppercase text-accent">Admin</p>
        <h1 className="mt-6 font-display text-h3 font-semibold text-cream">Welcome back</h1>
        <p className="mx-auto mt-3 max-w-xs text-sm text-cream/70">
          Sign in with the Google account approved for HigherLife360 admin access.
        </p>
        <div className="mt-8">
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
