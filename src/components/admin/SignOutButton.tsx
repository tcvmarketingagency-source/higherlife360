'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className={
        className ??
        'font-sans text-xs font-semibold uppercase tracking-widest text-cream/70 transition-colors hover:text-gold disabled:opacity-60'
      }
    >
      {loading ? 'Signing Out…' : 'Sign Out'}
    </button>
  );
}
