'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadImageToMedia, MEDIA_BUCKET } from '@/lib/media-upload';
import { useToast } from '@/components/admin/ToastProvider';

type LibraryImage = { name: string; url: string };

/**
 * Inline image field for the About page form — shows the current image
 * and a "Change Image" button that opens the same upload/library-pick
 * pattern as the Site Images admin's ReplaceImageModal. Unlike that
 * modal, picking an image here only updates this field's local value
 * (passed up via onChange) rather than saving immediately — the About
 * page form has one combined "Save Changes" button for everything.
 */
export function ImagePickerField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'upload' | 'library'>('upload');
  const [uploading, setUploading] = useState(false);
  const [libraryImages, setLibraryImages] = useState<LibraryImage[] | null>(null);

  useEffect(() => {
    if (!open || tab !== 'library' || libraryImages !== null) return;
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
  }, [open, tab, libraryImages]);

  async function handleUploadFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const { url } = await uploadImageToMedia(supabase, file);
      onChange(url);
      setOpen(false);
      toast.success(`${label} updated — remember to save your changes.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed — please try again.');
    } finally {
      setUploading(false);
    }
  }

  function handlePick(url: string) {
    onChange(url);
    setOpen(false);
    toast.success(`${label} updated — remember to save your changes.`);
  }

  return (
    <div>
      <p className="font-sans text-sm font-semibold text-ink">{label}</p>
      <div className="mt-2 flex items-center gap-4">
        <div className="flex h-20 w-32 flex-shrink-0 items-center justify-center overflow-hidden border border-ink/10 bg-ink/5">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-center text-[10px] text-ink/40">No image set</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border border-gold px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold-deep transition-colors hover:bg-gold hover:text-navy"
        >
          Change Image
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 px-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto border border-gold/20 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-display text-h4 font-semibold text-ink">Change: {label}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={uploading}
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
                  disabled={uploading}
                  onChange={(e) => handleUploadFile(e.target.files?.[0])}
                  className="block text-sm text-ink/70"
                />
                {uploading && <p className="mt-3 text-sm text-ink/60">Uploading&hellip;</p>}
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
                        onClick={() => handlePick(image.url)}
                        className="group relative aspect-square overflow-hidden border border-ink/10"
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
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
