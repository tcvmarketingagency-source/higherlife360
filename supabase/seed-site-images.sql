-- HigherLife360 — seed site_images with the current hardcoded photos
-- Run this AFTER supabase/admin-schema.sql.
-- Safe to re-run: upserts on the unique `key`, so running it again just
-- re-syncs label/description text and leaves any image the team has
-- already replaced through the admin untouched... EXCEPT this seed also
-- overwrites image_url. Only run it once on a fresh project, or drop the
-- "image_url" line from the "do update set" clause below if you want to
-- re-run it later without clobbering images the team has since changed.

insert into public.site_images (key, label, description, image_url) values
  ('home_hero_chapter_1', 'Homepage Hero — Crest', 'The standalone crest hero at the very top of the homepage (above the scrolling photo tour) — displayed in full via object-contain, so any replacement can be any aspect ratio without getting cropped. Currently the church crest.', 'https://images.unsplash.com/photo-1769088243271-d4768cd60482?q=80&w=2400&auto=format&fit=crop'),
  ('home_hero_chapter_2', 'Homepage Hero Tour — Chapter 1', 'Scrolling photo tour, first chapter — worship, "Encounter God."', 'https://images.unsplash.com/photo-1776091104217-02e3732a4a81?q=80&w=2400&auto=format&fit=crop'),
  ('home_hero_chapter_3', 'Homepage Hero Tour — Chapter 2', 'Scrolling photo tour, second chapter — worship band on stage, "Discover Purpose."', 'https://images.unsplash.com/photo-1510384742052-1abcb6282645?q=80&w=2400&auto=format&fit=crop'),
  ('home_hero_chapter_4', 'Homepage Hero Tour — Chapter 3', 'Scrolling photo tour, third chapter — small group in a prayer huddle, "Find Your Family."', 'https://images.unsplash.com/photo-1609234656388-0ff363383899?q=80&w=2400&auto=format&fit=crop'),
  ('home_hero_chapter_5', 'Homepage Hero Tour — Chapter 4', 'Scrolling photo tour, fourth and final chapter — fellowship at a stone archway, "Live a Higher Life."', 'https://images.unsplash.com/photo-1569292567777-e5d61a759322?q=80&w=2400&auto=format&fit=crop'),

  ('vision_hero', 'Vision Page Hero', 'Full-bleed background behind "We exist to help every person encounter God and live a Higher Life."', 'https://images.unsplash.com/photo-1776864926188-124eb99610e8?q=80&w=2400&auto=format&fit=crop'),
  ('live_hero', 'Live Page Hero', 'Full-bleed background behind the Watch Live page header.', 'https://images.unsplash.com/photo-1565804951749-2426372cdc74?q=80&w=2400&auto=format&fit=crop'),
  ('recording_hero', 'Messages Page Hero', 'Full-bleed background behind the sermon library header.', 'https://images.unsplash.com/photo-1514902915413-c58ad04fd61e?q=80&w=2400&auto=format&fit=crop'),
  ('branches_hero', 'Branches Page Hero', 'Full-bleed background behind the Branches page header.', 'https://images.unsplash.com/photo-1580136926756-f4bb02d2b813?q=80&w=2400&auto=format&fit=crop'),
  ('events_hero', 'Events Page Hero', 'Full-bleed background behind the Events page header.', 'https://images.unsplash.com/photo-1565804903593-d0bdb8256894?q=80&w=2400&auto=format&fit=crop'),
  ('donate_hero', 'Give Page Hero', 'Full-bleed background behind "Your Generosity Changes Lives."', 'https://images.unsplash.com/photo-1682263557065-192c50c79d30?q=80&w=2400&auto=format&fit=crop'),
  ('join_hero', 'Join Us Page Hero', 'Full-bleed background behind "You Belong Here."', 'https://images.unsplash.com/photo-1569292567777-e5d61a759322?q=80&w=2400&auto=format&fit=crop')
on conflict (key) do update set
  label = excluded.label,
  description = excluded.description,
  image_url = excluded.image_url;

-- Note: `founder_portrait` is intentionally NOT seeded here — the site
-- currently uses a generic placeholder graphic (not a real photo), so
-- there's no existing photo URL to preserve. It still appears in the
-- admin's Site Images grid (under "Founder"), showing the placeholder
-- until Pastor Sushil's team uploads a real portrait.
