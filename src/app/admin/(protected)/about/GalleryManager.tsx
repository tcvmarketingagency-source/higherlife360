'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { uploadImageToMedia } from '@/lib/media-upload';
import { useToast } from '@/components/admin/ToastProvider';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import type { AboutGalleryRow } from '@/lib/database.types';
import { addGalleryImage, updateGalleryAltText, deleteGalleryImage, reorderGallery } from './actions';

export function GalleryManager({ initialPhotos }: { initialPhotos: AboutGalleryRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [altDrafts, setAltDrafts] = useState<Record<string, string>>({});

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const { url } = await uploadImageToMedia(supabase, file);
      const result = await addGalleryImage(url, '');
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Photo added to the gallery — live on the site now.');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed — please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleAltSave(id: string) {
    const draft = altDrafts[id];
    if (draft === undefined) return;
    const result = await updateGalleryAltText(id, draft);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, alt_text: draft } : p)));
    toast.success('Description saved.');
  }

  async function handleDelete(id: string) {
    const result = await deleteGalleryImage(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    toast.success('Photo removed from the gallery.');
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    const next = [...photos];
    [next[index], next[target]] = [next[target], next[index]];
    setPhotos(next);
    setReordering(true);
    const result = await reorderGallery(next.map((p) => p.id));
    setReordering(false);
    if (result.error) {
      toast.error(result.error);
      setPhotos(photos); // revert on failure
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-ink/60">
          {photos.length} photo{photos.length === 1 ? '' : 's'} — reorder with the arrows, or add a
          new one below.
        </p>
        <label className="cursor-pointer border border-gold px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold-deep transition-colors hover:bg-gold hover:text-navy">
          {uploading ? 'Uploading…' : 'Add Photo'}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => handleUpload(e.target.files?.[0])}
            className="hidden"
          />
        </label>
      </div>

      {photos.length === 0 ? (
        <p className="mt-6 text-sm text-ink/60">No photos yet — add the first one above.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo, index) => (
            <div key={photo.id} className="border border-ink/10 bg-white">
              <div className="aspect-video w-full bg-ink/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.image_url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <label className="block text-xs font-semibold uppercase tracking-widest text-ink/50">
                  Alt text
                </label>
                <input
                  type="text"
                  defaultValue={photo.alt_text}
                  placeholder="Describe this photo for screen readers"
                  onChange={(e) => setAltDrafts((prev) => ({ ...prev, [photo.id]: e.target.value }))}
                  onBlur={() => handleAltSave(photo.id)}
                  className="mt-1 w-full border border-ink/15 px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      disabled={index === 0 || reordering}
                      onClick={() => move(index, -1)}
                      aria-label="Move earlier"
                      className="border border-ink/20 px-2 py-1 text-xs text-ink/70 hover:text-ink disabled:opacity-30"
                    >
                      &uarr;
                    </button>
                    <button
                      type="button"
                      disabled={index === photos.length - 1 || reordering}
                      onClick={() => move(index, 1)}
                      aria-label="Move later"
                      className="border border-ink/20 px-2 py-1 text-xs text-ink/70 hover:text-ink disabled:opacity-30"
                    >
                      &darr;
                    </button>
                  </div>
                  <ConfirmDialog
                    triggerLabel="Delete"
                    title="Remove this photo?"
                    description="It will disappear from the About page gallery immediately. This can't be undone."
                    onConfirm={() => handleDelete(photo.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
