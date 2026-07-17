-- SAMPLE / TEST DATA — HigherLife360 sermons
-- These 4 rows are placeholder content so you can see the /recording page fully
-- populated (featured message, Netflix-style series rows, filters, grid).
-- They are NOT real messages. Delete them once you've added real content:
--
--   delete from public.sermons where title in (
--     'The Weight of Grace',
--     'Rooted and Rising',
--     'The Foundation of Faith',
--     'Generosity Without Measure'
--   );
--
-- video_url below uses a fake (non-resolving) YouTube-style URL on purpose —
-- it exercises the embed-detection logic without linking to any real video.
-- Replace with real video URLs once you have them.

insert into public.sermons
  (title, speaker, series, description, video_url, thumbnail_url, scripture, duration, published_at)
values
  (
    'The Weight of Grace',
    'Pastor Sushil',
    'A Higher Life',
    'A message on carrying grace as both gift and responsibility, and what it means to extend it to a world in need.',
    'https://www.youtube.com/watch?v=sample0000001',
    null,
    'Ephesians 2:8-9',
    '42 min',
    now() - interval '2 days'
  ),
  (
    'Rooted and Rising',
    'Pastor Sushil',
    'A Higher Life',
    'What it means to stay rooted in faith while rising into the calling God has placed on your life.',
    'https://www.youtube.com/watch?v=sample0000002',
    null,
    'Colossians 2:6-7',
    '38 min',
    now() - interval '9 days'
  ),
  (
    'The Foundation of Faith',
    'Pastor Anita',
    'Foundations',
    'An introduction to what it means to live a Higher Life — a life of purpose, freedom, and impact, built on solid ground.',
    'https://www.youtube.com/watch?v=sample0000003',
    null,
    'Matthew 7:24-25',
    '45 min',
    now() - interval '16 days'
  ),
  (
    'Generosity Without Measure',
    'Pastor Anita',
    'Foundations',
    'Why we give — not out of obligation, but out of overflow. A study on open-handed living.',
    'https://www.youtube.com/watch?v=sample0000004',
    null,
    '2 Corinthians 9:6-7',
    '40 min',
    now() - interval '23 days'
  );
