import { createClient } from '@supabase/supabase-js';
import type { Database, AboutPageRow, AboutGalleryRow } from './database.types';

// Separate client, same reasoning as src/lib/site-images.ts: this query's
// fetch is tagged `next: { revalidate: 60 }` so an admin's edit shows up
// within a minute instead of being cached for the life of the running
// server, without forcing every route that reads it out of static
// generation the way `no-store` on the shared client would.
const aboutClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { global: { fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }) } }
);

const FALLBACK_ABOUT_PAGE: AboutPageRow = {
  id: '',
  singleton: true,
  hero_eyebrow: 'Who We Are',
  hero_title: 'About HigherLife Fellowship International',
  hero_subtitle: 'One church, one family, spanning the nations — this is our story.',
  hero_image_url: null,
  story_eyebrow: 'Our Story',
  story_title: 'How It All Began',
  story_body:
    'HigherLife Fellowship International began in 2017 in Pune, Maharashtra, and has since grown to 120+ branches across 10+ nations, with 230,000+ people connected worldwide.',
  founder_eyebrow: 'A Word From Our Pastor',
  founder_title: 'A Personal Welcome',
  founder_message: 'Welcome to HigherLife.',
  founder_signature: '— Pastor Sushil, Founder & Lead Pastor, HigherLife',
  founder_image_url: null,
  founder_cta_label: 'Watch the Full Message',
  founder_cta_url: '#',
  gallery_eyebrow: 'Life at HigherLife',
  gallery_title: 'Moments From Our Family',
  gallery_subtitle: 'A glimpse into worship, fellowship, and life together across the HigherLife family.',
  font_pairing_key: 'heritage-serif',
  heading_color: '#0F1523',
  body_color: '#2B2B2B',
  updated_at: '',
};

/**
 * Fetches the About page's single settings row. Deliberately fails soft
 * (falls back to hardcoded copy) if the table doesn't exist yet or
 * Supabase is briefly unreachable — the page should never 500 just
 * because this one query hiccupped.
 */
export async function getAboutPage(): Promise<AboutPageRow> {
  try {
    const { data, error } = await aboutClient
      .from('about_page')
      .select('*')
      .eq('singleton', true)
      .maybeSingle();
    if (error || !data) return FALLBACK_ABOUT_PAGE;
    return data;
  } catch {
    return FALLBACK_ABOUT_PAGE;
  }
}

/** Fetches the About page's gallery photos, in admin-managed display order. */
export async function getAboutGallery(): Promise<AboutGalleryRow[]> {
  try {
    const { data, error } = await aboutClient
      .from('about_gallery')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/** Splits a textarea's blank-line-separated paragraphs into an array. */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
