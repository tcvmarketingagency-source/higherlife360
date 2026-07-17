'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const { error } = await supabase.from('newsletter').insert([{ email: email.trim() }]);

    if (error) {
      setStatus('error');
      setErrorMessage(
        error.code === '23505'
          ? 'That email is already subscribed.'
          : 'Something went wrong. Please try again.'
      );
      return;
    }

    setStatus('success');
    setEmail('');
  }

  if (status === 'success') {
    return <p className="mt-4 font-sans text-sm text-gold">Thanks — you’re on the list.</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full border border-gold/30 bg-transparent px-4 py-3 font-sans text-sm text-cream placeholder:text-cream/70 focus:border-gold focus:outline-none"
        />
        <Button
          variant="primary"
          type="submit"
          disabled={status === 'submitting'}
          className={
            status === 'submitting'
              ? 'cursor-not-allowed justify-center whitespace-nowrap opacity-60'
              : 'justify-center whitespace-nowrap'
          }
        >
          {status === 'submitting' ? 'Signing Up…' : 'Sign Up'}
        </Button>
      </form>
      {status === 'error' && (
        <p role="alert" className="mt-2 font-sans text-xs text-gold">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
