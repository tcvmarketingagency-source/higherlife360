import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MEDIA_BUCKET } from '@/lib/media-upload';
import { MediaLibraryClient, type MediaFile } from './MediaLibraryClient';

export const metadata: Metadata = { title: 'Media Library' };
export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

  const initialFiles: MediaFile[] = (data ?? [])
    .filter((f) => f.id)
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(f.name).data.publicUrl,
      createdAt: f.created_at,
      sizeBytes: f.metadata?.size ?? null,
    }));

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink">Media Library</h1>
      <p className="mt-2 text-sm text-ink/70">
        Upload photos to use as sermon thumbnails, event images, or site images. {initialFiles.length}{' '}
        image{initialFiles.length === 1 ? '' : 's'} stored.
      </p>
      <div className="mt-8">
        <MediaLibraryClient initialFiles={initialFiles} />
      </div>
    </div>
  );
}
