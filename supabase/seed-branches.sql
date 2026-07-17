-- HigherLife360 — branches: add `country` column + SAMPLE / TEST branch rows
-- Paste into the Supabase SQL editor and run.

-- =========================================================
-- Schema change: the original branches table (from the initial schema.sql)
-- didn't have a `country` column. The /branches page needs one for the
-- country filter, since HigherLife spans 10+ countries. Safe to re-run.
-- =========================================================
alter table public.branches add column if not exists country text;

-- =========================================================
-- SAMPLE / TEST DATA
-- 6 placeholder branches so /branches and /branches/[id] are fully
-- populated for testing (map pins, cards, country filter, detail pages).
-- These are NOT real branches. Replace with real data, then delete these:
--
--   delete from public.branches where name like 'HigherLife %(Sample)';
--
-- lat/lng below are the real coordinates of each named city (safe to keep
-- even after you replace the rest of the row with real address/pastor/etc).
-- =========================================================
insert into public.branches
  (name, address, city, country, lat, lng, service_times, pastor_name, photo_url, phone)
values
  (
    'HigherLife Pune (Sample)',
    '123 Koregaon Park Road',
    'Pune',
    'India',
    18.5204,
    73.8567,
    'Sundays 9:00 AM & 11:00 AM',
    'Sushil',
    'https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=1200&auto=format&fit=crop',
    '+91 98765 43210'
  ),
  (
    'HigherLife Mumbai (Sample)',
    '45 Bandra West',
    'Mumbai',
    'India',
    19.0760,
    72.8777,
    'Sundays 10:00 AM',
    'Anita',
    'https://images.unsplash.com/photo-1776091104217-02e3732a4a81?q=80&w=1200&auto=format&fit=crop',
    '+91 98765 43211'
  ),
  (
    'HigherLife Bengaluru (Sample)',
    '78 Indiranagar',
    'Bengaluru',
    'India',
    12.9716,
    77.5946,
    'Sundays 9:30 AM & 5:00 PM',
    'Rahul',
    'https://images.unsplash.com/photo-1550177977-ad69e8f3cae0?q=80&w=1200&auto=format&fit=crop',
    '+91 98765 43212'
  ),
  (
    'HigherLife London (Sample)',
    '12 Camden High Street',
    'London',
    'United Kingdom',
    51.5072,
    -0.1276,
    'Sundays 11:00 AM',
    'James Whitfield',
    'https://images.unsplash.com/photo-1539783903272-86fd9a3e4ece?q=80&w=1200&auto=format&fit=crop',
    '+44 20 7946 0958'
  ),
  (
    'HigherLife Dubai (Sample)',
    '9 Jumeirah Beach Road',
    'Dubai',
    'United Arab Emirates',
    25.2048,
    55.2708,
    'Fridays 6:00 PM',
    'Faisal',
    'https://images.unsplash.com/photo-1766899922114-c19a8a7472d2?q=80&w=1200&auto=format&fit=crop',
    '+971 4 123 4567'
  ),
  (
    'HigherLife Nairobi (Sample)',
    '21 Westlands Avenue',
    'Nairobi',
    'Kenya',
    -1.2921,
    36.8219,
    'Sundays 9:00 AM',
    'Grace',
    'https://images.unsplash.com/photo-1748810417930-987996d1a9e9?q=80&w=1200&auto=format&fit=crop',
    '+254 700 123456'
  );
