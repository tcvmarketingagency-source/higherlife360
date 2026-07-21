import { supabase } from '@/lib/supabase';

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
    const { data, error } = await supabase.from('site_images').select('key, image_url');
    if (error || !data) return {};
    return Object.fromEntries(data.map((row) => [row.key, row.image_url]));
  } catch {
    return {};
  }
}
