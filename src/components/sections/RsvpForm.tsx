'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function RsvpForm({ eventId }: { eventId: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const guests = Number(formData.get('guests') ?? 1) || 1;

    const { error } = await supabase.from('event_rsvps').insert([
      {
        event_id: eventId,
        name,
        email,
        phone: phone || null,
        guests,
      },
    ]);

    if (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again in a moment.');
      return;
    }

    setStatus('success');
    form.reset();
  }

  if (status === 'success') {
    return (
      <div className="border border-gold/30 bg-white p-8 text-center">
        <p className="font-display text-h4 font-semibold text-ink">You&rsquo;re on the list.</p>
        <p className="mt-2 text-sm text-ink/70">
          We&rsquo;ve saved your RSVP — we&rsquo;ll see you there.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 border border-ink/10 bg-white p-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" />
        <Field label="Number of Guests" name="guests" type="number" defaultValue="1" min={1} />
      </div>

      {status === 'error' && (
        <p role="alert" className="font-sans text-sm font-semibold text-gold-deep">
          {errorMessage}
        </p>
      )}

      <div>
        <Button
          type="submit"
          variant="primary"
          disabled={status === 'submitting'}
          className={status === 'submitting' ? 'cursor-not-allowed opacity-60' : undefined}
        >
          {status === 'submitting' ? 'Submitting…' : 'RSVP'}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required = false,
  defaultValue,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  min?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="font-sans text-xs uppercase tracking-widest text-ink/70">
        {label}
        {required && <span className="text-navy-elevated"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        min={min}
        className="border border-ink/20 bg-transparent px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none"
      />
    </div>
  );
}
