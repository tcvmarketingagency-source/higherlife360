'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function SignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignIn() {
    setLoading(true);
    setError('');
    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });

    if (signInError) {
      setError('Something went wrong starting sign-in. Please try again.');
      setLoading(false);
    }
    // On success the browser is redirected to Google, then back to
    // /admin/auth/callback — nothing else to do here.
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-3 bg-gold px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.85z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z"
          />
        </svg>
        {loading ? 'Signing In…' : 'Sign in with Google'}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-center text-sm font-semibold text-gold-deep">
          {error}
        </p>
      )}
    </div>
  );
}
