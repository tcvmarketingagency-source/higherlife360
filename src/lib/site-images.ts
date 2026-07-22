import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// A separate client from the shared `supabase` export, used only here.
// This query's fetch is tagged `next: { revalidate: 60 }` so an admin's
// image swap in /admin/site-images shows up within a minute instead of
// being cached for the life of the running server — that was a real bug:
// the homepage kept serving a since-replaced image indefinitely across
// requests, even on a route already marked `force-dynamic`, because
// Next's Data Cache caches individual fetch() calls independently of the
// route's own dynamic/static setting. The fix belongs on this one query,
// not on the shared client — pointing the shared client's every request
// at `no-store` was tried first and reverted, because it also forced
// every *other* page that happens to call this function (vision, donate,
// join, events, branches, recording, live — none of which need
// per-request freshness) out of static generation entirely.
const siteImagesClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }) } }
);

/**
 * Fetches every admin-managed image override as a plain key → URL map.
 * Used by public pages alongside their existing hardcoded UNSPLASH_*
 * constants: `siteImages['vision_hero'] ?? UNSPLASH_HERO_CATHEDRAL_INTERIOR`.
 *
 * Deliberately fails soft — if the site_images table doesn't exist yet (the
 * admin SQL hasn't been run), or Supabase is briefly unreachable, this
 * returns an empty map rather than throwing, so every page keeps rendering
 * its current hardcoded photo exactly as before.
 */
export async function getSiteImageMap(): Promise<Record<string, string>> {
  try {
    const { data, error } = await siteImagesClient.from('site_images').select('key, image_url');
    if (error || !data) return {};
    return Object.fromEntries(data.map((row) => [row.key, row.image_url]));
  } catch {
    return {};
  }
}
