-- HigherLife360 — event_rsvps table + SAMPLE / TEST event rows
-- Paste into the Supabase SQL editor and run.

-- =========================================================
-- New table: event_rsvps
-- Used by the built-in RSVP form on /events/[id] for events that don't
-- have an external register_url. Same PII rationale as connect_cards /
-- newsletter: insert-only for the public, no public read.
-- =========================================================
create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  guests integer not null default 1,
  created_at timestamptz not null default now()
);

comment on table public.event_rsvps is
  'RSVPs from the built-in event registration form. Contains PII — not publicly readable.';

create index if not exists event_rsvps_event_id_idx on public.event_rsvps (event_id);

alter table public.event_rsvps enable row level security;

drop policy if exists "Public can submit event RSVPs" on public.event_rsvps;
create policy "Public can submit event RSVPs"
  on public.event_rsvps
  for insert
  to anon, authenticated
  with check (true);

-- =========================================================
-- SAMPLE / TEST DATA
-- 6 placeholder events — 5 upcoming, 1 past — spanning 4 categories, most
-- linked to the sample branches from seed-branches.sql (via a name lookup,
-- so this still works fine even if you haven't run that file — branch_id
-- just comes back null in that case). NOT real events. Replace with real
-- ones, then delete these:
--
--   delete from public.events where title like '%(Sample)';
-- =========================================================
insert into public.events
  (title, description, image_url, start_time, end_time, branch_id, category, register_url)
values
  (
    'HigherLife Conference 2026 (Sample)',
    'Three days of worship, teaching, and encounter with leaders from across the HigherLife family.',
    'https://images.unsplash.com/photo-1762968274962-20c12e6e8ecd?q=80&w=1200&auto=format&fit=crop',
    now() + interval '30 days',
    now() + interval '32 days',
    (select id from public.branches where name = 'HigherLife Pune (Sample)' limit 1),
    'Conference',
    null
  ),
  (
    'Friday Night Worship (Sample)',
    'An evening set apart for worship, prayer, and ministry — come as you are.',
    'https://images.unsplash.com/photo-1760092189954-5b2f6eb3ca88?q=80&w=1200&auto=format&fit=crop',
    now() + interval '5 days',
    now() + interval '5 days' + interval '2 hours',
    (select id from public.branches where name = 'HigherLife Mumbai (Sample)' limit 1),
    'Worship Night',
    null
  ),
  (
    'Youth Summer Camp (Sample)',
    'A weekend away for teens — games, worship, and a whole lot of fun.',
    'https://images.unsplash.com/photo-1550177977-ad69e8f3cae0?q=80&w=1200&auto=format&fit=crop',
    now() + interval '45 days',
    now() + interval '47 days',
    (select id from public.branches where name = 'HigherLife Bengaluru (Sample)' limit 1),
    'Youth',
    'https://forms.gle/sample-youth-camp-signup'
  ),
  (
    'Community Outreach Day (Sample)',
    'Serving our neighbors together — meals, supplies, and practical love in action.',
    'https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=1200&auto=format&fit=crop',
    now() + interval '15 days',
    now() + interval '15 days' + interval '4 hours',
    (select id from public.branches where name = 'HigherLife London (Sample)' limit 1),
    'Outreach',
    null
  ),
  (
    'Global Leaders Summit (Sample)',
    'A gathering for HigherLife campus and ministry leaders from every nation we serve.',
    'https://images.unsplash.com/photo-1762968274962-20c12e6e8ecd?q=80&w=1200&auto=format&fit=crop',
    now() + interval '60 days',
    now() + interval '61 days',
    null,
    'Conference',
    'https://forms.gle/sample-leaders-summit'
  ),
  (
    'New Year Prayer Night (Sample)',
    'We welcomed the new year in prayer and worship together.',
    'https://images.unsplash.com/photo-1760092189954-5b2f6eb3ca88?q=80&w=1200&auto=format&fit=crop',
    now() - interval '20 days',
    now() - interval '20 days' + interval '2 hours',
    (select id from public.branches where name = 'HigherLife Pune (Sample)' limit 1),
    'Worship Night',
    null
  );
