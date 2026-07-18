'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getNextServiceOccurrence, resolveLiveStatus } from '@/lib/live-status';

function useCountdown(targetMs: number | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (targetMs === null) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [targetMs]);

  if (targetMs === null) return null;
  const diff = Math.max(0, targetMs - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

// Compact "next live message" countdown for the homepage — the full
// live-status logic (with the video embed) lives on /live; this is just the
// invitation.
export function NextServiceCountdown() {
  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState(false);
  const [nextService, setNextService] = useState<{ startMs: number; label: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    setLive(resolveLiveStatus(now));
    const next = getNextServiceOccurrence(now);
    setNextService(next ? { startMs: next.startMs, label: next.service.label } : null);
    setMounted(true);
  }, []);

  const countdown = useCountdown(!live ? (nextService?.startMs ?? null) : null);

  if (!mounted) return null;

  if (live) {
    return (
      <div className="inline-flex items-center gap-3 border border-gold/40 bg-ink/40 px-6 py-3 backdrop-blur-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
        </span>
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-cream">
          We&rsquo;re Live Right Now
        </span>
        <Button href="/live" variant="primary" className="ml-2 !px-5 !py-1.5 !text-xs">
          Watch Now
        </Button>
      </div>
    );
  }

  if (!countdown) return null;

  return (
    <div className="inline-flex flex-wrap items-center justify-center gap-4 border border-gold/40 bg-ink/40 px-6 py-3 backdrop-blur-sm sm:gap-5">
      <span className="font-sans text-xs uppercase tracking-widest text-cream/70">
        Next Live Message{nextService ? ` · ${nextService.label}` : ''}
      </span>
      <div className="flex items-center gap-3 tabular-nums">
        {[
          { value: countdown.days, label: 'd' },
          { value: countdown.hours, label: 'h' },
          { value: countdown.minutes, label: 'm' },
          { value: countdown.seconds, label: 's' },
        ].map((unit) => (
          <span key={unit.label} className="font-display text-lg font-semibold text-gold">
            {String(unit.value).padStart(2, '0')}
            <span className="ml-0.5 font-sans text-xs font-normal text-cream/60">{unit.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
