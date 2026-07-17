type CalendarEvent = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: string; // ISO string
  endTime?: string | null; // ISO string
};

function toICSDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function defaultEnd(startTime: string): string {
  return new Date(new Date(startTime).getTime() + 60 * 60000).toISOString();
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const start = toICSDate(event.startTime);
  const end = toICSDate(event.endTime ?? defaultEnd(event.startTime));
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description ?? '',
    location: event.location ?? '',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildICSFile(event: CalendarEvent): string {
  const start = toICSDate(event.startTime);
  const end = toICSDate(event.endTime ?? defaultEnd(event.startTime));
  const stamp = toICSDate(new Date().toISOString());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HigherLife360//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@higherlife360`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeICSText(event.description)}` : '',
    event.location ? `LOCATION:${escapeICSText(event.location)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);

  return lines.join('\r\n');
}
