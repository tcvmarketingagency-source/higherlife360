'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadImageToMedia, MEDIA_BUCKET } from '@/lib/media-upload';
import { useToast } from '@/components/admin/ToastProvider';

type LibraryImage = { name: string; url: string };

export function ReplaceImageModal({
  label,
  onClose,
  onReplace,
}: {
  label: string;
  onClose: () => void;
  onReplace: (url: string) => Promise<void>;
}) {
  const toast = useToast();
  const [tab, setTab] = useState<'upload' | 'library'>('upload');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [libraryImages, setLibraryImages] = useState<LibraryImage[] | null>(null);

  useEffect(() => {
    if (tab !== 'library' || libraryImages !== null) return;
    (async () => {
      const supabase = createClient();
      const { data } = await supabase.storage
        .from(MEDIA_BUCKET)
        .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });
      setLibraryImages(
        (data ?? [])
          .filter((f) => f.id)
          .map((f) => ({
            name: f.name,
            url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(f.name).data.publicUrl,
          }))
      );
    })();
  }, [tab, libraryImages]);

  async function handleUploadFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const { url } = await uploadImageToMedia(supabase, file);
      setSaving(true);
      await onReplace(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed — please try again.');
    } finally {
      setUploading(false);
      setSaving(false);
    }
  }

  async function handlePick(url: string) {
    setSaving(true);
    try {
      await onReplace(url);
    } finally {
      setSaving(false);
    }
  }

  const busy = uploading || saving;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 px-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto border border-gold/20 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-h4 font-semibold text-ink">Replace: {label}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="text-2xl leading-none text-ink/50 hover:text-ink"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest ${tab === 'upload' ? 'bg-navy-elevated text-cream' : 'border border-ink/20 text-ink/70'}`}
          >
            Upload New
          </button>
          <button
            type="button"
            onClick={() => setTab('library')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest ${tab === 'library' ? 'bg-navy-elevated text-cream' : 'border border-ink/20 text-ink/70'}`}
          >
            Choose from Library
          </button>
        </div>

        {tab === 'upload' ? (
          <div className="mt-5">
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => handleUploadFile(e.target.files?.[0])}
              className="block text-sm text-ink/70"
            />
            {busy && <p className="mt-3 text-sm text-ink/60">Uploading and saving&hellip;</p>}
          </div>
        ) : (
          <div className="mt-5">
            {libraryImages === null ? (
              <p className="text-sm text-ink/60">Loading your media library&hellip;</p>
            ) : libraryImages.length === 0 ? (
              <p className="text-sm text-ink/60">
                No images in the Media Library yet — upload one instead.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {libraryImages.map((image) => (
                  <button
                    key={image.name}
                    type="button"
                    disabled={busy}
                    onClick={() => handlePick(image.url)}
                    className="group relative aspect-square overflow-hidden border border-ink/10 disabled:opacity-60"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt={image.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}
            {busy && <p className="mt-3 text-sm text-ink/60">Saving&hellip;</p>}
          </div>
        )}
      </div>
    </div>
  );
}
