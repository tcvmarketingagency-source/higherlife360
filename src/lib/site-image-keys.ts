import {
  UNSPLASH_HERO_CROSS_AURORA,
  UNSPLASH_HERO_WORSHIP,
  UNSPLASH_HERO_WORSHIP_BAND,
  UNSPLASH_HERO_SMALL_GROUP,
  UNSPLASH_HERO_FELLOWSHIP,
  UNSPLASH_HERO_CATHEDRAL_INTERIOR,
  UNSPLASH_HERO_WORSHIP_NIGHT,
  UNSPLASH_HERO_OPEN_BIBLE,
  UNSPLASH_HERO_BACKGROUND,
  UNSPLASH_EVENTS_HERO_BACKGROUND,
  UNSPLASH_HERO_FAMILY_PEWS,
} from './unsplash-placeholders';

export type SiteImageGroup =
  | 'Homepage'
  | 'Vision'
  | 'Live'
  | 'Messages'
  | 'Branches'
  | 'Events'
  | 'Donate'
  | 'Join';

export type SiteImageKeyDef = {
  key: string;
  group: SiteImageGroup;
  label: string;
  description: string;
  /** Current hardcoded image — used if the DB has no row for this key yet,
   * so the site never breaks even before the SQL seed has been run. */
  fallback: string | null;
};

// The single source of truth for every admin-manageable image on the
// public site — used to seed the database (see supabase/seed-site-images.sql,
// which must be kept in sync with this list by hand since SQL can't import
// TypeScript), to group/label the admin's Site Images grid, and as the
// code-side fallback whenever a key is missing from site_images.
export const SITE_IMAGE_KEYS: SiteImageKeyDef[] = [
  {
    key: 'home_hero_chapter_1',
    group: 'Homepage',
    label: 'Homepage Hero — Crest',
    description:
      'The standalone crest hero at the very top of the homepage (above the scrolling photo tour) — displayed in full via object-contain, so any replacement can be any aspect ratio without getting cropped. Currently the church crest.',
    fallback: UNSPLASH_HERO_CROSS_AURORA,
  },
  {
    key: 'home_hero_chapter_2',
    group: 'Homepage',
    label: 'Homepage Hero Tour — Chapter 1',
    description: 'Scrolling photo tour, first chapter — worship, "Encounter God."',
    fallback: UNSPLASH_HERO_WORSHIP,
  },
  {
    key: 'home_hero_chapter_3',
    group: 'Homepage',
    label: 'Homepage Hero Tour — Chapter 2',
    description: 'Scrolling photo tour, second chapter — worship band on stage, "Discover Purpose."',
    fallback: UNSPLASH_HERO_WORSHIP_BAND,
  },
  {
    key: 'home_hero_chapter_4',
    group: 'Homepage',
    label: 'Homepage Hero Tour — Chapter 3',
    description: 'Scrolling photo tour, third chapter — small group in a prayer huddle, "Find Your Family."',
    fallback: UNSPLASH_HERO_SMALL_GROUP,
  },
  {
    key: 'home_hero_chapter_5',
    group: 'Homepage',
    label: 'Homepage Hero Tour — Chapter 4',
    description: 'Scrolling photo tour, fourth and final chapter — fellowship at a stone archway, "Live a Higher Life."',
    fallback: UNSPLASH_HERO_FELLOWSHIP,
  },
  {
    key: 'vision_hero',
    group: 'Vision',
    label: 'Vision Page Hero',
    description: 'Full-bleed background behind "We exist to help every person encounter God and live a Higher Life."',
    fallback: UNSPLASH_HERO_CATHEDRAL_INTERIOR,
  },
  {
    key: 'live_hero',
    group: 'Live',
    label: 'Live Page Hero',
    description: 'Full-bleed background behind the Watch Live page header.',
    fallback: UNSPLASH_HERO_WORSHIP_NIGHT,
  },
  {
    key: 'recording_hero',
    group: 'Messages',
    label: 'Messages Page Hero',
    description: 'Full-bleed background behind the sermon library header.',
    fallback: UNSPLASH_HERO_OPEN_BIBLE,
  },
  {
    key: 'branches_hero',
    group: 'Branches',
    label: 'Branches Page Hero',
    description: 'Full-bleed background behind the Branches page header.',
    fallback: UNSPLASH_HERO_BACKGROUND,
  },
  {
    key: 'events_hero',
    group: 'Events',
    label: 'Events Page Hero',
    description: 'Full-bleed background behind the Events page header.',
    fallback: UNSPLASH_EVENTS_HERO_BACKGROUND,
  },
  {
    key: 'donate_hero',
    group: 'Donate',
    label: 'Give Page Hero',
    description: 'Full-bleed background behind "Your Generosity Changes Lives."',
    fallback: UNSPLASH_HERO_FAMILY_PEWS,
  },
  {
    key: 'join_hero',
    group: 'Join',
    label: 'Join Us Page Hero',
    description: 'Full-bleed background behind "You Belong Here."',
    fallback: UNSPLASH_HERO_FELLOWSHIP,
  },
];

export function siteImageKeysByGroup(): Record<SiteImageGroup, SiteImageKeyDef[]> {
  const groups = {} as Record<SiteImageGroup, SiteImageKeyDef[]>;
  for (const def of SITE_IMAGE_KEYS) {
    if (!groups[def.group]) groups[def.group] = [];
    groups[def.group].push(def);
  }
  return groups;
}
