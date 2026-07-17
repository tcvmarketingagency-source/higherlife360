-- HigherLife360 — initial schema
-- Paste this into the Supabase SQL editor (Project > SQL Editor > New query) and run it.
-- Safe to re-run: tables use "if not exists" and policies are dropped before recreation.

-- gen_random_uuid() is built into Postgres 13+ (Supabase's default), but this
-- extension is included as a harmless safety net for older/self-hosted setups.
create extension if not exists pgcrypto;

-- =========================================================
-- sermons
-- Recorded and live messages powering the /live and /recording
-- (Messages) pages and the homepage "Current Message" card.
-- =========================================================
create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text,
  series text,
  description text,
  video_url text,
  thumbnail_url text,
  scripture text,
  duration text,
  published_at timestamptz not null default now()
);

comment on table public.sermons is
  'Recorded and live messages shown on the Messages/Live pages.';

create index if not exists sermons_published_at_idx on public.sermons (published_at desc);

alter table public.sermons enable row level security;

drop policy if exists "Public can read sermons" on public.sermons;
create policy "Public can read sermons"
  on public.sermons
  for select
  to anon, authenticated
  using (true);

-- =========================================================
-- branches
-- Physical campus locations for the /branches page.
-- =========================================================
create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  lat double precision,
  lng double precision,
  service_times text,
  pastor_name text,
  photo_url text,
  phone text
);

comment on table public.branches is
  'Physical campus locations shown on the Branches page.';

alter table public.branches enable row level security;

drop policy if exists "Public can read branches" on public.branches;
create policy "Public can read branches"
  on public.branches
  for select
  to anon, authenticated
  using (true);

-- =========================================================
-- events
-- Upcoming/past events for the /events page and homepage.
-- branch_id is nullable so an event can be online-only or
-- span all campuses; deleting a branch un-links its events
-- rather than deleting the event history.
-- =========================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  start_time timestamptz not null,
  end_time timestamptz,
  branch_id uuid references public.branches (id) on delete set null,
  category text,
  register_url text
);

comment on table public.events is
  'Upcoming and past events shown on the Events page, optionally tied to a branch.';

create index if not exists events_start_time_idx on public.events (start_time);
create index if not exists events_branch_id_idx on public.events (branch_id);

alter table public.events enable row level security;

drop policy if exists "Public can read events" on public.events;
create policy "Public can read events"
  on public.events
  for select
  to anon, authenticated
  using (true);

-- =========================================================
-- connect_cards
-- Lead-capture submissions from Join Us / "I'm New" forms.
-- Contains PII (name, email, phone) — intentionally NOT
-- publicly readable. Read via the service role key from a
-- trusted server context only (e.g. an admin dashboard).
-- =========================================================
create table if not exists public.connect_cards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  interest text,
  message text,
  created_at timestamptz not null default now()
);

comment on table public.connect_cards is
  'Lead-capture submissions from Join Us / connect forms. Contains PII — not publicly readable.';

create index if not exists connect_cards_created_at_idx on public.connect_cards (created_at desc);

alter table public.connect_cards enable row level security;

drop policy if exists "Public can submit connect cards" on public.connect_cards;
create policy "Public can submit connect cards"
  on public.connect_cards
  for insert
  to anon, authenticated
  with check (true);

-- =========================================================
-- newsletter
-- Email signups from the footer newsletter form.
-- Same PII rationale as connect_cards: insert-only for the public.
-- =========================================================
create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

comment on table public.newsletter is
  'Newsletter signup emails from the footer form. Contains PII — not publicly readable.';

alter table public.newsletter enable row level security;

drop policy if exists "Public can subscribe to newsletter" on public.newsletter;
create policy "Public can subscribe to newsletter"
  on public.newsletter
  for insert
  to anon, authenticated
  with check (true);
