-- HigherLife360 — remove the site_images rows left over from the deleted
-- /ministries page. Run this once against the live Supabase project (SQL
-- Editor) after the code deploy that removes /ministries — these 12 keys
-- (the page hero + all 11 ministry card images) no longer have any code
-- reading them, so the rows are just clutter in the admin's Site Images
-- grid if left in place.

delete from public.site_images
where key in (
  'ministries_hero',
  'ministry_kids',
  'ministry_students',
  'ministry_young_adults',
  'ministry_mens',
  'ministry_womens',
  'ministry_marriage_family',
  'ministry_small_groups',
  'ministry_worship',
  'ministry_missions_outreach',
  'ministry_prayer',
  'ministry_new_believers'
);
