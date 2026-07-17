'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { QrPlaceholder } from './QrPlaceholder';

type Currency = 'INR' | 'USD';
type GivingType = 'one-time' | 'recurring';
type Frequency = 'weekly' | 'biweekly' | 'monthly';
type PaymentMethod = 'card' | 'upi' | 'qr';
type Status = 'idle' | 'submitting' | 'success';

// Default currency shown on load — change here if most givers are elsewhere.
const DEFAULT_CURRENCY: Currency = 'INR';

const CURRENCY_CONFIG: Record<Currency, { symbol: string; presets: number[] }> = {
  INR: { symbol: '₹', presets: [500, 1000, 2500, 5000] },
  USD: { symbol: '$', presets: [10, 25, 50, 100] },
};

// PLACEHOLDER: fund designations — edit to match real fund names.
const FUND_OPTIONS = [
  'Tithes & Offerings',
  'Missions & Outreach',
  'Building & Expansion',
  'Wherever Needed Most',
];

// Illustrative only — match this to the real gateway fee once Razorpay
// (~2%) or Stripe (~2.9% + fixed fee) is wired up.
const TRANSACTION_FEE_RATE = 0.025;

export function DonationForm() {
  const [givingType, setGivingType] = useState<GivingType>('one-time');
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    CURRENCY_CONFIG[DEFAULT_CURRENCY].presets[1]
  );
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [fund, setFund] = useState(FUND_OPTIONS[0]);
  const [coverFee, setCoverFee] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [status, setStatus] = useState<Status>('idle');

  const { symbol, presets } = CURRENCY_CONFIG[currency];
  const baseAmount = isCustom ? Number(customAmount) || 0 : (selectedPreset ?? 0);
  const feeAmount = coverFee ? Math.round(baseAmount * TRANSACTION_FEE_RATE) : 0;
  const totalAmount = baseAmount + feeAmount;

  function handleCurrencyChange(next: Currency) {
    setCurrency(next);
    setIsCustom(false);
    setSelectedPreset(CURRENCY_CONFIG[next].presets[1]);
    setCustomAmount('');
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (totalAmount <= 0) return;
    setStatus('submitting');

    const donationPayload = {
      amount: totalAmount,
      currency,
      givingType,
      frequency: givingType === 'recurring' ? frequency : null,
      fund,
      coverFee,
      paymentMethod,
    };

    // PAYMENT INTEGRATION GOES HERE — Razorpay for India / Stripe for international
    //   const gateway = currency === 'INR' ? razorpay : stripe;
    //   const result = await gateway.charge(donationPayload);
    //   if (!result.success) { setStatus('idle'); setErrorMessage(...); return; }
    // For now this just simulates a network call and shows a mock success state.
    void donationPayload;
    await new Promise((resolve) => setTimeout(resolve, 900));

    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className="border border-gold/30 bg-white p-10 text-center sm:p-14">
        <p className="font-display text-h3 font-semibold text-ink">
          Thank you for your generosity 🙏
        </p>
        <p className="mt-3 text-body text-ink/70">A receipt is on its way to your email.</p>
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="font-sans text-sm font-semibold uppercase tracking-widest text-crimson hover:text-gold"
          >
            Make Another Gift
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gold/30 bg-white p-6 sm:p-10">
      {/* One-time / Recurring */}
      <div
        role="group"
        aria-label="Giving frequency"
        className="grid grid-cols-2 gap-2 border border-ink/10 p-1"
      >
        {(['one-time', 'recurring'] as const).map((type) => (
          <button
            key={type}
            type="button"
            aria-pressed={givingType === type}
            onClick={() => setGivingType(type)}
            className={cn(
              'py-2.5 font-sans text-sm font-medium uppercase tracking-widest transition-colors',
              givingType === type ? 'bg-gold text-crimson-deep' : 'text-ink/70 hover:text-ink'
            )}
          >
            {type === 'one-time' ? 'One-Time' : 'Recurring'}
          </button>
        ))}
      </div>

      {givingType === 'recurring' && (
        <div className="mt-4">
          <label
            htmlFor="frequency"
            className="font-sans text-xs uppercase tracking-widest text-ink/70"
          >
            Frequency
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={(event) => setFrequency(event.target.value as Frequency)}
            className="mt-2 w-full border border-ink/20 bg-transparent px-4 py-3 font-sans text-sm text-ink focus:border-gold focus:outline-none"
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every 2 Weeks</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      )}

      {/* Currency toggle */}
      <div className="mt-6 flex items-center justify-between">
        <p className="font-sans text-xs uppercase tracking-widest text-ink/70">Amount</p>
        <div role="group" aria-label="Currency" className="flex gap-1 border border-ink/10 p-0.5">
          {(['INR', 'USD'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={currency === option}
              onClick={() => handleCurrencyChange(option)}
              className={cn(
                'px-3 py-1 font-sans text-xs font-semibold uppercase transition-colors',
                currency === option ? 'bg-crimson text-cream' : 'text-ink/70 hover:text-ink'
              )}
            >
              {CURRENCY_CONFIG[option].symbol} {option}
            </button>
          ))}
        </div>
      </div>

      {/* Preset amounts */}
      <div role="group" aria-label="Preset amount" className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {presets.map((amount) => (
          <button
            key={amount}
            type="button"
            aria-pressed={!isCustom && selectedPreset === amount}
            onClick={() => {
              setIsCustom(false);
              setSelectedPreset(amount);
            }}
            className={cn(
              'border py-3 font-sans text-sm font-semibold transition-colors',
              !isCustom && selectedPreset === amount
                ? 'border-gold bg-gold text-crimson-deep'
                : 'border-ink/20 text-ink hover:border-gold'
            )}
          >
            {symbol}
            {amount.toLocaleString()}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={isCustom}
          onClick={() => setIsCustom(true)}
          className={cn(
            'border py-3 font-sans text-sm font-semibold transition-colors',
            isCustom
              ? 'border-gold bg-gold text-crimson-deep'
              : 'border-ink/20 text-ink hover:border-gold'
          )}
        >
          Custom
        </button>
      </div>

      {isCustom && (
        <div className="mt-3 flex items-center border border-gold bg-transparent px-4 py-3">
          <span className="font-sans text-sm text-ink/70">{symbol}</span>
          <input
            type="number"
            min={1}
            inputMode="decimal"
            aria-label="Custom amount"
            value={customAmount}
            onChange={(event) => setCustomAmount(event.target.value)}
            placeholder="Enter amount"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className="ml-2 w-full bg-transparent font-sans text-sm text-ink placeholder:text-ink/30 focus:outline-none"
          />
        </div>
      )}

      {/* Fund designation */}
      <div className="mt-6">
        <label htmlFor="fund" className="font-sans text-xs uppercase tracking-widest text-ink/70">
          Where would you like to give?
        </label>
        <select
          id="fund"
          value={fund}
          onChange={(event) => setFund(event.target.value)}
          className="mt-2 w-full border border-ink/20 bg-transparent px-4 py-3 font-sans text-sm text-ink focus:border-gold focus:outline-none"
        >
          {FUND_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Cover transaction fee */}
      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={coverFee}
          onChange={(event) => setCoverFee(event.target.checked)}
          className="mt-1 h-4 w-4 accent-gold"
        />
        <span className="text-sm text-ink/70">
          <span className="font-medium text-ink">Cover the transaction fee.</span> Add a small
          amount so 100% of your gift reaches the mission.
        </span>
      </label>

      {/* Payment method */}
      <div className="mt-6">
        <p className="font-sans text-xs uppercase tracking-widest text-ink/70">Payment Method</p>
        <div role="group" aria-label="Payment method" className="mt-2 grid grid-cols-3 gap-2">
          {(['card', 'upi', 'qr'] as const).map((method) => (
            <button
              key={method}
              type="button"
              aria-pressed={paymentMethod === method}
              onClick={() => setPaymentMethod(method)}
              className={cn(
                'border py-3 font-sans text-xs font-semibold uppercase tracking-widest transition-colors',
                paymentMethod === method
                  ? 'border-gold bg-gold text-crimson-deep'
                  : 'border-ink/20 text-ink/70 hover:border-gold'
              )}
            >
              {method === 'card' ? 'Card' : method === 'upi' ? 'UPI' : 'QR Code'}
            </button>
          ))}
        </div>
        {paymentMethod === 'qr' && (
          <div className="mt-4 flex justify-center">
            <QrPlaceholder label="Scan to Pay" />
          </div>
        )}
      </div>

      {/* Submit — deliberately larger than the standard Button component for
          this one critical conversion moment. */}
      <button
        type="submit"
        disabled={totalAmount <= 0 || status === 'submitting'}
        className="mt-8 w-full bg-gold px-8 py-4 font-sans text-base font-semibold uppercase tracking-[0.15em] text-crimson-deep transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting'
          ? 'Processing…'
          : `Give ${symbol}${totalAmount.toLocaleString()} Now`}
      </button>

      <p className="mt-4 text-center text-xs text-ink/70">
        This is a demo — no payment will be charged.
      </p>
    </form>
  );
}
