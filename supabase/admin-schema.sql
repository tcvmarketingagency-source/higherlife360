-- HigherLife360 — admin panel schema (Phase 1)
-- Run this AFTER supabase/schema.sql, in the Supabase SQL Editor.
-- Safe to re-run: tables use "if not exists" and policies/triggers are
-- dropped before recreation.

-- =========================================================
-- admin_users
-- The allowlist. Only Google accounts whose email appears here may access
-- /admin or perform any write against sermons, events, or site_images.
-- No public policies at all: not even a signed-in admin can list every
-- row (see the "read own row" policy below) — this keeps other admins'
-- emails private from each other, and keeps non-admins from ever reading
-- the table's contents.
-- =========================================================
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Allowlist of Google accounts permitted to access /admin. Managed by hand via the SQL editor — there is intentionally no UI for this in Phase 1.';

alter table public.admin_users enable row level security;

drop policy if exists "Admins can read their own row" on public.admin_users;
create policy "Admins can read their own row"
  on public.admin_users
  for select
  to authenticated
  using (email = (auth.jwt() ->> 'email'));

-- is_admin() — security definer so it can check admin_users even though
-- that table has no general-purpose read policy. Used inside every write
-- policy below. This is the actual enforcement boundary: even if a bug
-- somewhere let a non-admin reach a page or call a Server Action, the
-- database itself still rejects the write.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where email = (auth.jwt() ->> 'email')
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

-- =========================================================
-- Write policies for existing public tables
-- schema.sql only ever granted public SELECT on sermons/events — nobody
-- could write to them at all. These add insert/update/delete, gated to
-- signed-in admins only.
-- =========================================================
drop policy if exists "Admins can insert sermons" on public.sermons;
create policy "Admins can insert sermons"
  on public.sermons for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update sermons" on public.sermons;
create policy "Admins can update sermons"
  on public.sermons for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete sermons" on public.sermons;
create policy "Admins can delete sermons"
  on public.sermons for delete
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can insert events" on public.events;
create policy "Admins can insert events"
  on public.events for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update events" on public.events;
create policy "Admins can update events"
  on public.events for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete events" on public.events;
create policy "Admins can delete events"
  on public.events for delete
  to authenticated
  using (public.is_admin());

-- =========================================================
-- site_images
-- Every currently-hardcoded site image, addressable by a stable `key` so
-- the admin can replace them without a code change. Public SELECT (the
-- public site reads these anonymously); writes restricted to admins.
-- =========================================================
create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  description text,
  image_url text not null,
  updated_at timestamptz not null default now()
);

comment on table public.site_images is
  'Admin-editable image overrides for hardcoded site imagery, looked up by stable `key`. Missing keys fall back to the code-side default so the site never breaks.';

alter table public.site_images enable row level security;

drop policy if exists "Public can read site images" on public.site_images;
create policy "Public can read site images"
  on public.site_images for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert site images" on public.site_images;
create policy "Admins can insert site images"
  on public.site_images for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update site images" on public.site_images;
create policy "Admins can update site images"
  on public.site_images for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete site images" on public.site_images;
create policy "Admins can delete site images"
  on public.site_images for delete
  to authenticated
  using (public.is_admin());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_images_set_updated_at on public.site_images;
create trigger site_images_set_updated_at
  before update on public.site_images
  for each row execute function public.set_updated_at();

-- =========================================================
-- Storage bucket: site-media
-- Public read (so <img> tags work with no auth), admin-only write.
-- =========================================================
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can read site-media" on storage.objects;
create policy "Public can read site-media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'site-media');

drop policy if exists "Admins can upload to site-media" on storage.objects;
create policy "Admins can upload to site-media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can update site-media" on storage.objects;
create policy "Admins can update site-media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'site-media' and public.is_admin())
  with check (bucket_id = 'site-media' and public.is_admin());

drop policy if exists "Admins can delete site-media" on storage.objects;
create policy "Admins can delete site-media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'site-media' and public.is_admin());

-- =========================================================
-- Insert Pastor Sushil's email HERE (and any other approved admins).
-- Replace the email/name below before running, or run this insert again
-- later to add more people. This is the ONLY step that grants access —
-- signing in with Google alone is not enough.
-- =========================================================
insert into public.admin_users (email, name, role)
values
  ('higherlife360@gmail.com', 'Pastor Sushil', 'admin'),
  ('tcvmarketingagency@gmail.com', 'TCV Marketing Agency', 'admin')
on conflict (email) do nothing;
