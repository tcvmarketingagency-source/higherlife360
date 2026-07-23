-- HigherLife360 — About Us page schema
-- Run this AFTER supabase/admin-schema.sql (it reuses is_admin(),
-- set_updated_at(), and the existing "site-media" storage bucket — no new
-- bucket needed). Safe to re-run: tables use "if not exists" and
-- policies/triggers are dropped before recreation.

-- =========================================================
-- about_page
-- A single-row settings table for the whole /about page: hero, story,
-- founder message, gallery section labels, and the admin's chosen font
-- pairing + text colors for the Our Story section. The `singleton`
-- column + its unique constraint is what guarantees there can only ever
-- be one row — an insert with singleton=true when a row already exists
-- fails the unique constraint, so the admin UI always upserts against
-- singleton=true rather than juggling a row id.
-- =========================================================
create table if not exists public.about_page (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true,

  hero_eyebrow text not null default '',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  hero_image_url text,

  story_eyebrow text not null default '',
  story_title text not null default '',
  -- Paragraphs are stored as one text field, separated by a blank line
  -- (\n\n) — the admin writes in a plain textarea, and the page splits on
  -- blank lines to render each paragraph as its own <p>. Simpler for a
  -- non-technical editor than managing a list of separate fields.
  story_body text not null default '',

  founder_eyebrow text not null default '',
  founder_title text not null default '',
  founder_message text not null default '',
  founder_signature text not null default '',
  founder_image_url text,
  founder_cta_label text not null default '',
  founder_cta_url text not null default '#',

  gallery_eyebrow text not null default '',
  gallery_title text not null default '',
  gallery_subtitle text not null default '',

  -- One of the curated keys in src/lib/about-fonts.ts (e.g.
  -- 'heritage-serif') — applied to the Our Story section's heading and
  -- body only (see src/app/about/page.tsx). Not a free-text font name:
  -- the app only ever looks this key up in that fixed list, so an
  -- arbitrary value here just falls back to the default pairing rather
  -- than rendering anything unexpected.
  font_pairing_key text not null default 'heritage-serif',

  -- Hex colors from the curated 20-swatch palette in
  -- src/lib/about-colors.ts, applied to the Our Story section's heading
  -- and body text. The admin UI only lets you pick a swatch that passes
  -- WCAG AA against the story section's cream background — enforced in
  -- the picker component, not here, so this column just stores whatever
  -- passed that gate.
  heading_color text not null default '#0F1523',
  body_color text not null default '#2B2B2B',

  updated_at timestamptz not null default now(),

  constraint about_page_singleton unique (singleton)
);

comment on table public.about_page is
  'Single-row settings for the /about page — hero, story, founder message, gallery labels, and Our Story''s font/color choices. Enforced as a single row via the singleton unique constraint.';

alter table public.about_page enable row level security;

drop policy if exists "Public can read about page" on public.about_page;
create policy "Public can read about page"
  on public.about_page for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert about page" on public.about_page;
create policy "Admins can insert about page"
  on public.about_page for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update about page" on public.about_page;
create policy "Admins can update about page"
  on public.about_page for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop trigger if exists about_page_set_updated_at on public.about_page;
create trigger about_page_set_updated_at
  before update on public.about_page
  for each row execute function public.set_updated_at();

-- =========================================================
-- about_gallery
-- Ordered list of photos for the About page's gallery section.
-- `sort_order` is a plain integer the admin's drag/reorder UI rewrites
-- for every row on each reorder — fine at this scale (a photo gallery,
-- not a list with thousands of rows).
-- =========================================================
create table if not exists public.about_gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

comment on table public.about_gallery is
  'Photo gallery images for the /about page, in admin-managed display order (sort_order).';

alter table public.about_gallery enable row level security;

drop policy if exists "Public can read about gallery" on public.about_gallery;
create policy "Public can read about gallery"
  on public.about_gallery for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert about gallery" on public.about_gallery;
create policy "Admins can insert about gallery"
  on public.about_gallery for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update about gallery" on public.about_gallery;
create policy "Admins can update about gallery"
  on public.about_gallery for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete about gallery" on public.about_gallery;
create policy "Admins can delete about gallery"
  on public.about_gallery for delete
  to authenticated
  using (public.is_admin());

-- =========================================================
-- Seed: about_page (placeholder copy) + about_gallery (placeholder photos)
-- Safe to re-run: the about_page upsert targets singleton=true, and the
-- gallery insert is skipped entirely if any row already exists (so
-- re-running this after the admin has added real photos won't duplicate
-- or clobber their work).
--
-- founder_image_url below is NOT a placeholder — it's the real portrait
-- already uploaded by the client through the old Site Images panel
-- (site_images.founder_portrait). This carries that exact file forward
-- so nothing appears to reset when the founder section moves to /about.
-- =========================================================
insert into public.about_page (
  singleton, hero_eyebrow, hero_title, hero_subtitle, hero_image_url,
  story_eyebrow, story_title, story_body,
  founder_eyebrow, founder_title, founder_message, founder_signature,
  founder_image_url, founder_cta_label, founder_cta_url,
  gallery_eyebrow, gallery_title, gallery_subtitle,
  font_pairing_key, heading_color, body_color
) values (
  true,
  'Who We Are',
  'About HigherLife Fellowship International',
  'One church, one family, spanning the nations — this is our story.',
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2400&auto=format&fit=crop',

  'Our Story',
  'How It All Began',
  E'In 2017, in a modest rented hall in Pune, Maharashtra, a small gathering of believers met with nothing but a shared conviction — that God was not finished with this city, and that an authentic encounter with His presence could change everything. There was no building, no budget, and no five-year plan. Just open hearts, open Bibles, and the belief that if they made room for God to move, He would show up. He did — and HigherLife Fellowship International was born.\n\nWhat began as a handful of people in one room did not stay contained to one room for long. As lives were transformed, so was the vision — one branch became several, one city became many, and within a few short years HigherLife had taken root across India and then beyond its borders. Today, the family spans more than 120 branches in over 10 nations, each one carrying the same heartbeat that started in Pune: encounter God, find true family, and live a Higher Life.\n\nToday, more than 230,000 people around the world call HigherLife home — from bustling cities to small towns, from lifelong believers to those taking their very first step of faith. The story that started in a rented hall is still being written, one branch, one Sunday, and one changed life at a time. And there is still room at the table for you.',

  'A Word From Our Pastor',
  'A Personal Welcome',
  E'In 2017, in a small rented hall in Pune, Maharashtra, a handful of us gathered with nothing but a conviction: that God wasn''t finished with this city, or with the people in it. We didn''t have a building, a budget, or a plan beyond that Sunday — just a hunger to see lives changed, and a belief that if we made room for God''s presence, He would show up. He did. And He hasn''t stopped since.\n\nI didn''t start HigherLife360 to build an organization. I started it because I''d seen what happens when ordinary people encounter God for themselves — not through a program, but through a real, tangible presence — and I couldn''t shake the conviction that everyone deserved that same chance. That''s still the heartbeat behind every branch we plant and every service we hold, whether it''s in Pune or on the other side of the world.\n\nSo whatever brought you here today — curiosity, a friend''s invitation, a hard season, or a quiet search for something more — you are welcome, exactly as you are. This isn''t a place you have to clean yourself up to enter. It''s a family, and there is a seat for you at the table.\n\nMy prayer is that HigherLife360 becomes a light in every city it touches — raising up a generation that lives free, gives generously, and carries hope wherever they go. I''m honored you''re here. Let''s take this next step together.',
  '— Pastor Sushil, Founder & Lead Pastor, HigherLife',
  'https://fqgwxwnujlezagmqnfmp.supabase.co/storage/v1/object/public/site-media/1784614032652-img-20260720-wa0002-jpg.jpeg',
  'Watch the Full Message',
  '#',

  'Life at HigherLife',
  'Moments From Our Family',
  'A glimpse into worship, fellowship, and life together across the HigherLife family.',

  'heritage-serif',
  '#0F1523',
  '#2B2B2B'
)
on conflict (singleton) do nothing;

insert into public.about_gallery (image_url, alt_text, sort_order)
select * from (values
  ('https://images.unsplash.com/photo-1776091104217-02e3732a4a81?q=80&w=1200&auto=format&fit=crop', 'Hands raised in worship during a Sunday service.', 0),
  ('https://images.unsplash.com/photo-1510384742052-1abcb6282645?q=80&w=1200&auto=format&fit=crop', 'Worship band leading the congregation on stage.', 1),
  ('https://images.unsplash.com/photo-1569292567777-e5d61a759322?q=80&w=1200&auto=format&fit=crop', 'A joyful group gathered at a church entrance.', 2),
  ('https://images.unsplash.com/photo-1609234656388-0ff363383899?q=80&w=1200&auto=format&fit=crop', 'A small group standing together in prayer.', 3),
  ('https://images.unsplash.com/photo-1565804903593-d0bdb8256894?q=80&w=1200&auto=format&fit=crop', 'A large worship night with the congregation gathered.', 4),
  ('https://images.unsplash.com/photo-1765947384446-415f16df7b65?q=80&w=1200&auto=format&fit=crop', 'A child in a church pew during a family service.', 5),
  ('https://images.unsplash.com/photo-1628717341663-0007b0ee2597?q=80&w=1200&auto=format&fit=crop', 'Volunteers packing food bags for community outreach.', 6),
  ('https://images.unsplash.com/photo-1739301674016-45dddb02e2dd?q=80&w=1200&auto=format&fit=crop', 'A women''s group reading scripture together.', 7)
) as seed(image_url, alt_text, sort_order)
where not exists (select 1 from public.about_gallery);

-- =========================================================
-- Retire the old founder_portrait site_images key — the founder
-- section (and its portrait) now lives on /about, managed through
-- about_page.founder_image_url above, not the Site Images panel.
-- =========================================================
delete from public.site_images where key = 'founder_portrait';
