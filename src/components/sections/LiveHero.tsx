'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { liveStreamUrl } from '@/lib/live-config';
import { getNextServiceOccurrence, resolveLiveStatus } from '@/lib/live-status';
import { getEmbedUrl } from '@/lib/video-embed';

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
    isZero: diff <= 0,
  };
}

export function LiveHero() {
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

  // If the countdown completes while the page is open, re-check live status
  // rather than freezing at 00:00:00:00.
  useEffect(() => {
    if (countdown?.isZero) {
      setLive(resolveLiveStatus(new Date()));
    }
  }, [countdown?.isZero]);

  if (!mounted) {
    return <div className="aspect-video w-full animate-pulse bg-crimson" />;
  }

  const embed = live ? getEmbedUrl(liveStreamUrl) : null;

  if (live && embed) {
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-gold/30 bg-ink">
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 bg-ink/70 px-3 py-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-cream">
            Live Now
          </span>
        </div>
        <iframe
          src={embed.embedUrl}
          title="HigherLife360 Live Service"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="border border-gold/30 bg-crimson-deep p-8 text-center sm:p-14">
      <p className="text-eyebrow font-semibold uppercase text-gold">
        We&apos;re Not Live Right Now
      </p>
      <h2 className="mt-4 font-display text-h2 font-semibold text-cream">
        {nextService ? `Next Service: ${nextService.label}` : 'Check back soon'}
      </h2>
      {countdown && (
        <div className="mx-auto mt-10 grid max-w-md grid-cols-4 gap-3 sm:gap-6">
          {[
            { value: countdown.days, label: 'Days' },
            { value: countdown.hours, label: 'Hours' },
            { value: countdown.minutes, label: 'Min' },
            { value: countdown.seconds, label: 'Sec' },
          ].map((unit) => (
            <div key={unit.label} className="border border-gold/20 py-4">
              <p className="font-display text-h2 font-semibold tabular-nums text-gold">
                {String(unit.value).padStart(2, '0')}
              </p>
              <p className="mt-1 font-sans text-xs uppercase tracking-widest text-cream/60">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-10">
        <Button href="/recording" variant="secondary">
          Watch Past Messages
        </Button>
      </div>
    </div>
  );
}
