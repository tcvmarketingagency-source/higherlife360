// ============================================================================
// LIVE PAGE CONFIG — edit the values below to control /live.
// Nothing else on the page needs to change; everything reads from here.
// ============================================================================

// Manual override for LIVE / OFFLINE state:
//   true  -> always show LIVE (even outside a scheduled service window)
//   false -> always show OFFLINE (even during a scheduled service window)
//   null  -> AUTO-DETECT based on `serviceSchedule` below (recommended)
export const isLiveNow: boolean | null = null;

// Paste your YouTube Live or Facebook Live URL here when going live. Supports:
//   YouTube:  https://www.youtube.com/watch?v=..., https://youtu.be/...,
//             https://www.youtube.com/live/...
//   Facebook: https://www.facebook.com/.../videos/..., https://fb.watch/...
// Leave as null when not streaming — the page safely shows the
// offline/countdown state instead of a broken player.
export const liveStreamUrl: string | null = null;

// Timezone all times in `serviceSchedule` are interpreted in. HigherLife
// began in Pune, India, so this defaults to India Standard Time. Change this
// one value if your primary broadcast timezone is different — the countdown
// and live-window detection both read from it.
export const TIMEZONE = 'Asia/Kolkata';

export type ServiceTime = {
  day: number; // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  time: string; // 24-hour "HH:mm", in the TIMEZONE above
  label: string; // shown as the "Next Service" label when offline
  durationMinutes: number; // how long the stream is considered "live" after start
};

// PLACEHOLDER — replace with HigherLife360's real weekly service schedule.
export const serviceSchedule: ServiceTime[] = [
  { day: 0, time: '09:00', label: 'Sunday Service', durationMinutes: 90 },
  { day: 0, time: '11:00', label: 'Sunday Service', durationMinutes: 90 },
  { day: 3, time: '19:00', label: 'Wednesday Service', durationMinutes: 90 },
];

export const WEEKDAY_LABELS: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};
