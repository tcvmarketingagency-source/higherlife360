import type { SupabaseClient } from '@supabase/supabase-js';
import { resizeImageFile } from './image-resize';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB pre-compression ceiling
export const MEDIA_BUCKET = 'site-media';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

/** Returns a friendly error message, or null if the file is acceptable. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only image files (JPG, PNG, WebP, GIF, SVG) can be uploaded here — video goes through a YouTube/Vimeo link instead.';
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `That image is too large (max ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))}MB). Try a smaller photo, or export it at a lower resolution.`;
  }
  return null;
}

function slugifyFilename(name: string): string {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + ext
  );
}

/**
 * Validates, resizes, and uploads an image to the shared `site-media`
 * bucket, returning its public URL. Used by the Media Library, and
 * anywhere else in the admin that offers an "upload an image" field
 * (sermon thumbnails, event photos, site image replacements).
 */
export async function uploadImageToMedia(
  supabase: SupabaseClient,
  file: File
): Promise<{ url: string; path: string }> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const resized = await resizeImageFile(file);
  const path = `${Date.now()}-${slugifyFilename(resized.name)}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, resized, {
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) {
    throw new Error('Upload failed — please try again in a moment.');
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  return { url: publicUrl, path };
}
