// Display timezone for event dates/times. Branches span 10+ countries, but
// this is the single default used across the /events pages for consistency —
// change this one value if events should display in a different zone.
export const EVENTS_TIMEZONE = 'Asia/Kolkata';

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: EVENTS_TIMEZONE,
  });
}

export function formatEventDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: EVENTS_TIMEZONE,
  });
}

export function formatEventTime(iso: string): string {
  return `${new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: EVENTS_TIMEZONE,
  })} IST`;
}

export function formatEventDateTimeRange(startTime: string, endTime: string | null): string {
  const datePart = formatEventDateShort(startTime);
  const startTimePart = new Date(startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: EVENTS_TIMEZONE,
  });
  if (!endTime) return `${datePart} · ${startTimePart} IST`;
  const endTimePart = new Date(endTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: EVENTS_TIMEZONE,
  });
  return `${datePart} · ${startTimePart} – ${endTimePart} IST`;
}

export function formatEventDuration(startTime: string, endTime: string | null): string | null {
  if (!endTime) return null;
  const ms = new Date(endTime).getTime() - new Date(startTime).getTime();
  if (ms <= 0) return null;
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.round((ms % 3600000) / 60000);
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} hr${hours === 1 ? '' : 's'}`);
  if (minutes > 0) parts.push(`${minutes} min`);
  return parts.length > 0 ? parts.join(' ') : null;
}

export function isPastEvent(event: { start_time: string }): boolean {
  return new Date(event.start_time).getTime() < Date.now();
}
