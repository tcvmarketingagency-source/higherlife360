-- HigherLife360 — seed site_images with the current hardcoded photos
-- Run this AFTER supabase/admin-schema.sql.
-- Safe to re-run: upserts on the unique `key`, so running it again just
-- re-syncs label/description text and leaves any image the team has
-- already replaced through the admin untouched... EXCEPT this seed also
-- overwrites image_url. Only run it once on a fresh project, or drop the
-- "image_url" line from the "do update set" clause below if you want to
-- re-run it later without clobbering images the team has since changed.

insert into public.site_images (key, label, description, image_url) values
  ('home_hero_chapter_1', 'Homepage Hero — Chapter 1', 'Cinematic hero, first chapter — cross silhouette under aurora, "Welcome Home."', 'https://images.unsplash.com/photo-1769088243271-d4768cd60482?q=80&w=2400&auto=format&fit=crop'),
  ('home_hero_chapter_2', 'Homepage Hero — Chapter 2', 'Cinematic hero, second chapter — worship, "Encounter God."', 'https://images.unsplash.com/photo-1776091104217-02e3732a4a81?q=80&w=2400&auto=format&fit=crop'),
  ('home_hero_chapter_3', 'Homepage Hero — Chapter 3', 'Cinematic hero, third chapter — worship band on stage, "Discover Purpose."', 'https://images.unsplash.com/photo-1510384742052-1abcb6282645?q=80&w=2400&auto=format&fit=crop'),
  ('home_hero_chapter_4', 'Homepage Hero — Chapter 4', 'Cinematic hero, fourth chapter — small group in a prayer huddle, "Find Your Family."', 'https://images.unsplash.com/photo-1609234656388-0ff363383899?q=80&w=2400&auto=format&fit=crop'),
  ('home_hero_chapter_5', 'Homepage Hero — Chapter 5', 'Cinematic hero, fifth and final chapter — fellowship at a stone archway, "Live a Higher Life."', 'https://images.unsplash.com/photo-1569292567777-e5d61a759322?q=80&w=2400&auto=format&fit=crop'),

  ('vision_hero', 'Vision Page Hero', 'Full-bleed background behind "We exist to help every person encounter God and live a Higher Life."', 'https://images.unsplash.com/photo-1776864926188-124eb99610e8?q=80&w=2400&auto=format&fit=crop'),
  ('live_hero', 'Live Page Hero', 'Full-bleed background behind the Watch Live page header.', 'https://images.unsplash.com/photo-1565804951749-2426372cdc74?q=80&w=2400&auto=format&fit=crop'),
  ('recording_hero', 'Messages Page Hero', 'Full-bleed background behind the sermon library header.', 'https://images.unsplash.com/photo-1514902915413-c58ad04fd61e?q=80&w=2400&auto=format&fit=crop'),
  ('branches_hero', 'Branches Page Hero', 'Full-bleed background behind the Branches page header.', 'https://images.unsplash.com/photo-1580136926756-f4bb02d2b813?q=80&w=2400&auto=format&fit=crop'),
  ('events_hero', 'Events Page Hero', 'Full-bleed background behind the Events page header.', 'https://images.unsplash.com/photo-1565804903593-d0bdb8256894?q=80&w=2400&auto=format&fit=crop'),
  ('donate_hero', 'Give Page Hero', 'Full-bleed background behind "Your Generosity Changes Lives."', 'https://images.unsplash.com/photo-1682263557065-192c50c79d30?q=80&w=2400&auto=format&fit=crop'),
  ('join_hero', 'Join Us Page Hero', 'Full-bleed background behind "You Belong Here."', 'https://images.unsplash.com/photo-1569292567777-e5d61a759322?q=80&w=2400&auto=format&fit=crop'),
  ('ministries_hero', 'Ministries Page Hero', 'Full-bleed background behind the Ministries page header.', 'https://images.unsplash.com/photo-1569292567777-e5d61a759322?q=80&w=2400&auto=format&fit=crop'),

  ('ministry_kids', 'Ministry Card — HigherLife Kids', 'Card image for the Kids ministry (Ages 0–12).', 'https://images.unsplash.com/photo-1765947384446-415f16df7b65?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_students', 'Ministry Card — HigherLife Students', 'Card image for the Students ministry (Ages 13–18).', 'https://images.unsplash.com/photo-1641337261712-3cb3f398331f?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_young_adults', 'Ministry Card — Young Adults', 'Card image for the Young Adults ministry (20s & 30s).', 'https://images.unsplash.com/photo-1569292567777-e5d61a759322?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_mens', 'Ministry Card — Men''s Discipleship', 'Card image for the Men''s Discipleship ministry.', 'https://images.unsplash.com/photo-1609234656388-0ff363383899?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_womens', 'Ministry Card — Women''s Discipleship', 'Card image for the Women''s Discipleship ministry.', 'https://images.unsplash.com/photo-1739301674016-45dddb02e2dd?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_marriage_family', 'Ministry Card — Marriage & Family', 'Card image for the Marriage & Family ministry.', 'https://images.unsplash.com/photo-1682263557065-192c50c79d30?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_small_groups', 'Ministry Card — Small Groups', 'Card image for the Small Groups ministry.', 'https://images.unsplash.com/photo-1514902915413-c58ad04fd61e?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_worship', 'Ministry Card — Worship', 'Card image for the Worship ministry.', 'https://images.unsplash.com/photo-1510384742052-1abcb6282645?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_missions_outreach', 'Ministry Card — Missions & Outreach', 'Card image for the Missions & Outreach ministry.', 'https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_prayer', 'Ministry Card — Prayer', 'Card image for the Prayer ministry.', 'https://images.unsplash.com/photo-1526746323784-6bc814d79273?q=80&w=1200&auto=format&fit=crop'),
  ('ministry_new_believers', 'Ministry Card — New Believers', 'Card image for the New Believers ministry.', 'https://images.unsplash.com/photo-1604745372175-27daa24a0a0e?q=80&w=1200&auto=format&fit=crop')
on conflict (key) do update set
  label = excluded.label,
  description = excluded.description,
  image_url = excluded.image_url;

-- Note: `founder_portrait` is intentionally NOT seeded here — the site
-- currently uses a generic placeholder graphic (not a real photo), so
-- there's no existing photo URL to preserve. It still appears in the
-- admin's Site Images grid (under "Founder"), showing the placeholder
-- until Pastor Sushil's team uploads a real portrait.
