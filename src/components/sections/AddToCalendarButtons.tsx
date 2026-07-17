'use client';

import { buildGoogleCalendarUrl, buildICSFile } from '@/lib/calendar';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function AddToCalendarButtons({
  id,
  title,
  description,
  location,
  startTime,
  endTime,
}: {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: string;
  endTime?: string | null;
}) {
  const event = { id, title, description, location, startTime, endTime };
  const googleUrl = buildGoogleCalendarUrl(event);

  function handleDownloadICS() {
    const ics = buildICSFile(event);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slugify(title)}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-ink/20 px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.15em] text-ink/70 transition-colors hover:border-gold hover:text-ink"
      >
        Add to Google Calendar
      </a>
      <button
        type="button"
        onClick={handleDownloadICS}
        className="border border-ink/20 px-6 py-2.5 font-sans text-xs font-medium uppercase tracking-[0.15em] text-ink/70 transition-colors hover:border-gold hover:text-ink"
      >
        Download .ics
      </button>
    </div>
  );
}
