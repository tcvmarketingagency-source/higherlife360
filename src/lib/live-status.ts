import {
  isLiveNow,
  liveStreamUrl,
  serviceSchedule,
  TIMEZONE,
  type ServiceTime,
} from './live-config';

function getZonedParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') parts[part.type] = part.value;
  }
  return parts;
}

// Classic no-library trick for a timezone's UTC offset: format `date` as
// wall-clock parts in `timeZone`, reinterpret those parts as if they were
// UTC, then diff against the real instant. Note: this uses `now`'s offset for
// occurrences up to 7 days out, which is exact for zones without DST (like
// IST, the default here) but could be off by an hour right around a DST
// transition if you switch TIMEZONE to a zone that observes it.
function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const p = getZonedParts(date, timeZone);
  const asUTC = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second)
  );
  return asUTC - date.getTime();
}

function getZonedNow(now: Date, timeZone: string) {
  const offsetMs = getTimeZoneOffsetMs(now, timeZone);
  const p = getZonedParts(now, timeZone);
  const zonedAsUTC = new Date(
    Date.UTC(
      Number(p.year),
      Number(p.month) - 1,
      Number(p.day),
      Number(p.hour),
      Number(p.minute),
      Number(p.second)
    )
  );
  return { zonedAsUTC, offsetMs };
}

export function getNextServiceOccurrence(
  now: Date
): { startMs: number; service: ServiceTime } | null {
  if (serviceSchedule.length === 0) return null;

  const { zonedAsUTC, offsetMs } = getZonedNow(now, TIMEZONE);
  const currentWeekday = zonedAsUTC.getUTCDay();
  const currentMinutesOfDay = zonedAsUTC.getUTCHours() * 60 + zonedAsUTC.getUTCMinutes();

  let best: { startMs: number; service: ServiceTime } | null = null;

  for (const service of serviceSchedule) {
    const [hourStr, minuteStr] = service.time.split(':');
    const serviceMinutesOfDay = Number(hourStr) * 60 + Number(minuteStr);

    let dayDiff = (service.day - currentWeekday + 7) % 7;
    if (dayDiff === 0 && serviceMinutesOfDay <= currentMinutesOfDay) {
      dayDiff = 7; // today's slot already started or passed — roll to next week
    }

    const candidate = new Date(zonedAsUTC);
    candidate.setUTCDate(candidate.getUTCDate() + dayDiff);
    candidate.setUTCHours(Number(hourStr), Number(minuteStr), 0, 0);

    const startMs = candidate.getTime() - offsetMs;

    if (!best || startMs < best.startMs) {
      best = { startMs, service };
    }
  }

  return best;
}

export function isWithinLiveWindow(now: Date): boolean {
  const { zonedAsUTC, offsetMs } = getZonedNow(now, TIMEZONE);
  const currentWeekday = zonedAsUTC.getUTCDay();

  for (const service of serviceSchedule) {
    if (service.day !== currentWeekday) continue;
    const [hourStr, minuteStr] = service.time.split(':');

    const start = new Date(zonedAsUTC);
    start.setUTCHours(Number(hourStr), Number(minuteStr), 0, 0);
    const startMs = start.getTime() - offsetMs;
    const endMs = startMs + service.durationMinutes * 60000;

    if (now.getTime() >= startMs && now.getTime() <= endMs) return true;
  }

  return false;
}

export function resolveLiveStatus(now: Date): boolean {
  if (isLiveNow !== null) return isLiveNow;
  if (!liveStreamUrl) return false; // never show LIVE without a stream URL set
  return isWithinLiveWindow(now);
}

export function formatServiceTime(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
}
