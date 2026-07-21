'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { uploadImageToMedia } from '@/lib/media-upload';
import { getEmbedUrl } from '@/lib/video-embed';
import { useToast } from '@/components/admin/ToastProvider';
import { createSermon, updateSermon } from './actions';
import type { SermonRow } from '@/lib/database.types';

const inputClass =
  'mt-1 w-full border border-ink/20 bg-transparent px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none';
const labelClass = 'font-sans text-xs uppercase tracking-widest text-ink/70';

export function SermonForm({ sermon }: { sermon?: SermonRow }) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(sermon);

  const [title, setTitle] = useState(sermon?.title ?? '');
  const [speaker, setSpeaker] = useState(sermon?.speaker ?? '');
  const [series, setSeries] = useState(sermon?.series ?? '');
  const [description, setDescription] = useState(sermon?.description ?? '');
  const [videoUrl, setVideoUrl] = useState(sermon?.video_url ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState(sermon?.thumbnail_url ?? '');
  const [thumbnailMode, setThumbnailMode] = useState<'upload' | 'paste'>('paste');
  const [scripture, setScripture] = useState(sermon?.scripture ?? '');
  const [duration, setDuration] = useState(sermon?.duration ?? '');
  const [publishedAt, setPublishedAt] = useState(
    (sermon?.published_at ?? new Date().toISOString()).slice(0, 10)
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const embed = videoUrl ? getEmbedUrl(videoUrl) : null;
  const videoInvalid = videoUrl.trim().length > 0 && !embed;

  async function handleThumbnailFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const { url } = await uploadImageToMedia(supabase, file);
      setThumbnailUrl(url);
      toast.success('Thumbnail uploaded.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed — please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      toast.error('A title is required.');
      return;
    }
    if (videoInvalid) {
      toast.error('That video URL doesn’t look like a YouTube or Vimeo link.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      speaker: speaker.trim() || null,
      series: series.trim() || null,
      description: description.trim() || null,
      video_url: videoUrl.trim() || null,
      thumbnail_url: thumbnailUrl.trim() || null,
      scripture: scripture.trim() || null,
      duration: duration.trim() || null,
      published_at: new Date(publishedAt).toISOString(),
    };

    const result = isEdit ? await updateSermon(sermon!.id, payload) : await createSermon(payload);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? 'Sermon updated.' : 'Sermon added.');
    router.push('/admin/sermons');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className={labelClass}>Title *</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Speaker</span>
          <input value={speaker} onChange={(e) => setSpeaker(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Series</span>
          <input value={series} onChange={(e) => setSeries(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Scripture</span>
          <input
            value={scripture}
            onChange={(e) => setScripture(e.target.value)}
            placeholder="e.g. John 3:16"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Duration</span>
          <input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 34 min"
            className={inputClass}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Published Date</span>
          <input
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <label className="mt-6 block">
        <span className={labelClass}>Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </label>

      <div className="mt-6">
        <span className={labelClass}>Video URL (YouTube or Vimeo link)</span>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className={inputClass}
        />
        {videoInvalid && (
          <p className="mt-2 text-xs font-semibold text-gold-deep">
            That doesn&rsquo;t look like a valid YouTube, Vimeo, or Facebook video link.
          </p>
        )}
        {embed && (
          <div className="mt-3 aspect-video w-full max-w-md overflow-hidden border border-ink/10">
            <iframe
              src={embed.embedUrl}
              title="Video preview"
              className="h-full w-full border-0"
              allow="accelerometer; encrypted-media; picture-in-picture"
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        <span className={labelClass}>Thumbnail</span>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setThumbnailMode('paste')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${thumbnailMode === 'paste' ? 'bg-navy-elevated text-cream' : 'border border-ink/20 text-ink/70'}`}
          >
            Paste URL
          </button>
          <button
            type="button"
            onClick={() => setThumbnailMode('upload')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${thumbnailMode === 'upload' ? 'bg-navy-elevated text-cream' : 'border border-ink/20 text-ink/70'}`}
          >
            Upload Image
          </button>
        </div>

        {thumbnailMode === 'paste' ? (
          <input
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => handleThumbnailFile(e.target.files?.[0])}
            className="mt-2 block text-sm text-ink/70"
          />
        )}

        {uploading && <p className="mt-2 text-xs text-ink/60">Uploading&hellip;</p>}
        {thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl}
            alt="Thumbnail preview"
            className="mt-3 h-32 w-56 max-w-full border border-ink/10 object-cover"
          />
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-gold px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Sermon'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/sermons')}
          className="font-sans text-xs font-semibold uppercase tracking-widest text-ink/60 hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
