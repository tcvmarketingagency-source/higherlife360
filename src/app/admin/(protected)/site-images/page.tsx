import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { siteImageKeysByGroup } from '@/lib/site-image-keys';
import { SiteImagesGrid } from './SiteImagesGrid';

export const metadata: Metadata = { title: 'Site Images' };
export const dynamic = 'force-dynamic';

export default async function AdminSiteImagesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_images').select('key, image_url');

  const imagesByKey = Object.fromEntries((data ?? []).map((row) => [row.key, row.image_url]));

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink">Site Images</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        Replace any photo used across the site — no code changes needed. Changes go live
        immediately: the next time anyone loads that page, they&rsquo;ll see the new image.
      </p>
      <div className="mt-8">
        <SiteImagesGrid groups={siteImageKeysByGroup()} imagesByKey={imagesByKey} />
      </div>
    </div>
  );
}
