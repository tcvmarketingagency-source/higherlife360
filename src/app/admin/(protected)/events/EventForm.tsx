'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { uploadImageToMedia } from '@/lib/media-upload';
import { useToast } from '@/components/admin/ToastProvider';
import { createEvent, updateEvent } from './actions';
import type { EventRow, BranchRow } from '@/lib/database.types';

const inputClass =
  'mt-1 w-full border border-ink/20 bg-transparent px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none';
const labelClass = 'font-sans text-xs uppercase tracking-widest text-ink/70';

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ event, branches }: { event?: EventRow; branches: BranchRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const isEdit = Boolean(event);

  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [imageUrl, setImageUrl] = useState(event?.image_url ?? '');
  const [imageMode, setImageMode] = useState<'upload' | 'paste'>('upload');
  const [startTime, setStartTime] = useState(toDatetimeLocal(event?.start_time ?? null));
  const [endTime, setEndTime] = useState(toDatetimeLocal(event?.end_time ?? null));
  const [branchId, setBranchId] = useState(event?.branch_id ?? '');
  const [category, setCategory] = useState(event?.category ?? '');
  const [registerUrl, setRegisterUrl] = useState(event?.register_url ?? '');

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleImageFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const { url } = await uploadImageToMedia(supabase, file);
      setImageUrl(url);
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed — please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event_: React.FormEvent<HTMLFormElement>) {
    event_.preventDefault();
    if (!title.trim()) {
      toast.error('A title is required.');
      return;
    }
    if (!startTime) {
      toast.error('A start time is required.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      image_url: imageUrl.trim() || null,
      start_time: new Date(startTime).toISOString(),
      end_time: endTime ? new Date(endTime).toISOString() : null,
      branch_id: branchId || null,
      category: category.trim() || null,
      register_url: registerUrl.trim() || null,
    };

    const result = isEdit ? await updateEvent(event!.id, payload) : await createEvent(payload);
    setSaving(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? 'Event updated.' : 'Event added.');
    router.push('/admin/events');
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
          <span className={labelClass}>Start Time *</span>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>End Time</span>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Branch</span>
          <select value={branchId} onChange={(e) => setBranchId(e.target.value)} className={inputClass}>
            <option value="">No specific branch / online</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={labelClass}>Category</span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Conference, Worship Night"
            className={inputClass}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className={labelClass}>Registration URL</span>
          <input
            value={registerUrl}
            onChange={(e) => setRegisterUrl(e.target.value)}
            placeholder="https://…"
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
        <span className={labelClass}>Event Image</span>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setImageMode('upload')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${imageMode === 'upload' ? 'bg-navy-elevated text-cream' : 'border border-ink/20 text-ink/70'}`}
          >
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => setImageMode('paste')}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${imageMode === 'paste' ? 'bg-navy-elevated text-cream' : 'border border-ink/20 text-ink/70'}`}
          >
            Paste URL
          </button>
        </div>

        {imageMode === 'upload' ? (
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => handleImageFile(e.target.files?.[0])}
            className="mt-2 block text-sm text-ink/70"
          />
        ) : (
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        )}

        {uploading && <p className="mt-2 text-xs text-ink/60">Uploading&hellip;</p>}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Event image preview"
            className="mt-3 h-32 w-56 max-w-full border border-ink/10 object-cover"
          />
        )}
        {!imageUrl && (
          <p className="mt-2 text-xs text-ink/50">
            No image? The public site will show a themed placeholder photo automatically.
          </p>
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-gold px-8 py-3 font-sans text-sm font-medium uppercase tracking-[0.15em] text-navy transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Event'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/events')}
          className="font-sans text-xs font-semibold uppercase tracking-widest text-ink/60 hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
