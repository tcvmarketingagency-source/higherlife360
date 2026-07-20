'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { useConnectCardPrefill } from '@/components/sections/JoinPageProvider';

const interestOptions = [
  'Planning a Visit',
  'Small Group',
  'Baptism',
  'Volunteering',
  'Membership',
  'New Believer',
  'Prayer Request',
  'Other',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ConnectCardForm() {
  const { request } = useConnectCardPrefill();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!request) return;
    setInterest(request.interest);
    if (request.note) setMessage(request.note);
  }, [request]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();

    if (!name) {
      setStatus('error');
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const { error } = await supabase.from('connect_cards').insert([
      {
        name,
        email,
        phone: phone || null,
        interest: interest || null,
        message: message.trim() || null,
      },
    ]);

    if (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again in a moment.');
      return;
    }

    setStatus('success');
    form.reset();
    setInterest('');
    setMessage('');
  }

  if (status === 'success') {
    return (
      <div className="border border-gold/30 bg-white p-10 text-center">
        <p className="font-display text-h3 font-semibold text-ink">Thank you!</p>
        <p className="mt-3 text-body text-ink/70">
          Someone from our team will reach out soon. Welcome to the family. 🙏
        </p>
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="font-sans text-sm font-semibold uppercase tracking-widest text-navy-elevated hover:text-gold-deep"
          >
            Submit Another Connect Card
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 border border-ink/10 bg-white p-8 sm:p-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Phone" name="phone" type="tel" />
        <div className="flex flex-col gap-2">
          <label
            htmlFor="interest"
            className="font-sans text-xs uppercase tracking-widest text-ink/70"
          >
            I’m Interested In
          </label>
          <select
            id="interest"
            name="interest"
            value={interest}
            onChange={(event) => setInterest(event.target.value)}
            className="border border-ink/20 bg-transparent px-4 py-3 font-sans text-sm text-ink focus:border-gold focus:outline-none"
          >
            <option value="" disabled>
              Select an option
            </option>
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="font-sans text-xs uppercase tracking-widest text-ink/70"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="How can we help?"
          className="border border-ink/20 bg-transparent px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none"
        />
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
          {status === 'submitting' ? 'Sending…' : 'Send Connect Card'}
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
        className="border border-ink/20 bg-transparent px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none"
      />
    </div>
  );
}
