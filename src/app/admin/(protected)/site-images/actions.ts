'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { SITE_IMAGE_KEYS } from '@/lib/site-image-keys';

export async function updateSiteImage(
  key: string,
  imageUrl: string
): Promise<{ error: string | null }> {
  const def = SITE_IMAGE_KEYS.find((k) => k.key === key);
  if (!def) return { error: 'Unknown image key.' };
  if (!imageUrl.trim()) return { error: 'An image is required.' };

  const supabase = await createClient();
  const { error } = await supabase
    .from('site_images')
    .upsert(
      { key, label: def.label, description: def.description, image_url: imageUrl.trim() },
      { onConflict: 'key' }
    );

  if (error) return { error: 'Could not save that image — please try again.' };

  // site_images can affect nearly every public route (homepage hero,
  // every page's hero band, the founder portrait) —
  // revalidating the whole app's layout is the simplest correct fix, and
  // costs nothing extra since Next only actually re-renders a route on its
  // next visit, not immediately. See the admin Site Images page for the
  // full explanation shown to the user.
  revalidatePath('/', 'layout');
  revalidatePath('/admin/site-images');
  revalidatePath('/admin');

  return { error: null };
}
