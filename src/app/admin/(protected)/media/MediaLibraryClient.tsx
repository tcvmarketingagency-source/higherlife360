'use client';

import { useCallback, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { uploadImageToMedia, MEDIA_BUCKET } from '@/lib/media-upload';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/ToastProvider';

export type MediaFile = {
  name: string;
  url: string;
  createdAt: string | null;
  sizeBytes: number | null;
};

function formatSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibraryClient({ initialFiles }: { initialFiles: MediaFile[] }) {
  const toast = useToast();
  const [files, setFiles] = useState(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list('', { limit: 200, sortBy: { column: 'created_at', order: 'desc' } });

    const next: MediaFile[] = (data ?? [])
      .filter((f) => f.id) // storage sometimes returns a placeholder ".emptyFolderPlaceholder" entry
      .map((f) => ({
        name: f.name,
        url: supabase.storage.from(MEDIA_BUCKET).getPublicUrl(f.name).data.publicUrl,
        createdAt: f.created_at,
        sizeBytes: f.metadata?.size ?? null,
      }));
    setFiles(next);
  }, []);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    let succeeded = 0;
    let failed = 0;

    for (const file of Array.from(fileList)) {
      try {
        await uploadImageToMedia(supabase, file);
        succeeded += 1;
      } catch (err) {
        failed += 1;
        toast.error(err instanceof Error ? err.message : `Couldn't upload ${file.name}.`);
      }
    }

    if (succeeded > 0) {
      toast.success(
        succeeded === 1 ? 'Image uploaded.' : `${succeeded} images uploaded.${failed ? ` (${failed} failed)` : ''}`
      );
      await refresh();
    }
    setUploading(false);
  }

  async function handleDelete(name: string) {
    const supabase = createClient();
    const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([name]);
    if (error) {
      toast.error('Could not delete that image — please try again.');
      return;
    }
    toast.success('Image deleted.');
    await refresh();
  }

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied.');
    } catch {
      toast.error('Could not copy the link — copy it manually from the address shown.');
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed p-10 text-center transition-colors ${
          dragOver ? 'border-gold bg-gold/5' : 'border-ink/20 bg-white'
        }`}
      >
        <p className="font-sans text-sm text-ink/70">Drag and drop images here, or</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="bg-gold px-6 py-2.5 font-sans text-xs font-semibold uppercase tracking-widest text-navy transition-colors hover:bg-gold-light disabled:opacity-60"
        >
          {uploading ? 'Uploading…' : 'Choose Files'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-xs text-ink/50">
          Images only (JPG, PNG, WebP, GIF, SVG), up to 10MB each — large photos are automatically
          resized. Videos aren&rsquo;t hosted here; paste a YouTube or Vimeo link wherever a video
          field appears instead.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {files.map((file) => (
          <div key={file.name} className="border border-ink/10 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={file.url} alt={file.name} className="aspect-square w-full object-cover" />
            <div className="p-3">
              <p className="truncate text-xs text-ink/70" title={file.name}>
                {file.name}
              </p>
              {file.sizeBytes !== null && (
                <p className="text-xs text-ink/40">{formatSize(file.sizeBytes)}</p>
              )}
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleCopy(file.url)}
                  className="text-xs font-semibold uppercase tracking-widest text-navy-elevated hover:text-gold-deep"
                >
                  Copy URL
                </button>
                <ConfirmDialog
                  triggerLabel="Delete"
                  title="Delete this image?"
                  description="This removes it from storage permanently. If it's currently used as a sermon thumbnail, event photo, or site image, that spot will fall back to its default until replaced."
                  onConfirm={() => handleDelete(file.name)}
                />
              </div>
            </div>
          </div>
        ))}
        {files.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink/60">
            No images uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}
