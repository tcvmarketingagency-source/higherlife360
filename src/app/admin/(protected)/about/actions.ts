'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { FONT_PAIRINGS } from '@/lib/about-fonts';
import { isValidAboutColor } from '@/lib/about-colors';
import type { AboutPageUpdate } from '@/lib/database.types';

export type AboutPageFormValues = {
  hero_eyebrow: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string;
  story_eyebrow: string;
  story_title: string;
  story_body: string;
  founder_eyebrow: string;
  founder_title: string;
  founder_message: string;
  founder_signature: string;
  founder_image_url: string;
  founder_cta_label: string;
  founder_cta_url: string;
  gallery_eyebrow: string;
  gallery_title: string;
  gallery_subtitle: string;
  font_pairing_key: string;
  heading_color: string;
  body_color: string;
};

function revalidateAbout() {
  revalidatePath('/about');
  revalidatePath('/admin/about');
}

export async function updateAboutPage(
  values: AboutPageFormValues
): Promise<{ error: string | null }> {
  if (!values.hero_title.trim()) {
    return { error: 'The hero title can’t be empty.' };
  }
  if (!values.story_title.trim() || !values.story_body.trim()) {
    return { error: 'The Our Story section needs both a title and body text.' };
  }
  if (!FONT_PAIRINGS.some((p) => p.key === values.font_pairing_key)) {
    return { error: 'Please choose one of the provided font pairings.' };
  }
  if (!isValidAboutColor(values.heading_color)) {
    return { error: 'That heading color isn’t one of the approved, accessible options — please pick a swatch from the palette.' };
  }
  if (!isValidAboutColor(values.body_color)) {
    return { error: 'That body color isn’t one of the approved, accessible options — please pick a swatch from the palette.' };
  }

  const update: AboutPageUpdate = {
    hero_eyebrow: values.hero_eyebrow.trim(),
    hero_title: values.hero_title.trim(),
    hero_subtitle: values.hero_subtitle.trim(),
    hero_image_url: values.hero_image_url.trim() || null,
    story_eyebrow: values.story_eyebrow.trim(),
    story_title: values.story_title.trim(),
    story_body: values.story_body.trim(),
    founder_eyebrow: values.founder_eyebrow.trim(),
    founder_title: values.founder_title.trim(),
    founder_message: values.founder_message.trim(),
    founder_signature: values.founder_signature.trim(),
    founder_image_url: values.founder_image_url.trim() || null,
    founder_cta_label: values.founder_cta_label.trim(),
    founder_cta_url: values.founder_cta_url.trim() || '#',
    gallery_eyebrow: values.gallery_eyebrow.trim(),
    gallery_title: values.gallery_title.trim(),
    gallery_subtitle: values.gallery_subtitle.trim(),
    font_pairing_key: values.font_pairing_key,
    heading_color: values.heading_color,
    body_color: values.body_color,
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from('about_page')
    .update(update)
    .eq('singleton', true);

  if (error) return { error: 'Could not save the About page — please try again.' };

  revalidateAbout();
  return { error: null };
}

export async function addGalleryImage(
  imageUrl: string,
  altText: string
): Promise<{ error: string | null }> {
  if (!imageUrl.trim()) return { error: 'An image is required.' };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from('about_gallery')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].sort_order + 1 : 0;

  const { error } = await supabase
    .from('about_gallery')
    .insert({ image_url: imageUrl.trim(), alt_text: altText.trim(), sort_order: nextOrder });

  if (error) return { error: 'Could not add that photo — please try again.' };

  revalidateAbout();
  return { error: null };
}

export async function updateGalleryAltText(
  id: string,
  altText: string
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('about_gallery')
    .update({ alt_text: altText.trim() })
    .eq('id', id);

  if (error) return { error: 'Could not save that description — please try again.' };

  revalidateAbout();
  return { error: null };
}

export async function deleteGalleryImage(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from('about_gallery').delete().eq('id', id);

  if (error) return { error: 'Could not remove that photo — please try again.' };

  revalidateAbout();
  return { error: null };
}

/** Rewrites sort_order for every photo to match the given id order (index = new sort_order). */
export async function reorderGallery(orderedIds: string[]): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from('about_gallery').update({ sort_order: index }).eq('id', id)
    )
  );

  if (results.some((r) => r.error)) {
    return { error: 'Could not save the new photo order — please try again.' };
  }

  revalidateAbout();
  return { error: null };
}
