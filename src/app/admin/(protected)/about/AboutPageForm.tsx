'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/admin/ToastProvider';
import type { AboutPageRow } from '@/lib/database.types';
import { DEFAULT_HEADING_COLOR, DEFAULT_BODY_COLOR } from '@/lib/about-colors';
import { ImagePickerField } from './ImagePickerField';
import { FontPickerField } from './FontPickerField';
import { ColorPickerField } from './ColorPickerField';
import { updateAboutPage, type AboutPageFormValues } from './actions';

function toFormValues(row: AboutPageRow): AboutPageFormValues {
  return {
    hero_eyebrow: row.hero_eyebrow,
    hero_title: row.hero_title,
    hero_subtitle: row.hero_subtitle,
    hero_image_url: row.hero_image_url ?? '',
    story_eyebrow: row.story_eyebrow,
    story_title: row.story_title,
    story_body: row.story_body,
    founder_eyebrow: row.founder_eyebrow,
    founder_title: row.founder_title,
    founder_message: row.founder_message,
    founder_signature: row.founder_signature,
    founder_image_url: row.founder_image_url ?? '',
    founder_cta_label: row.founder_cta_label,
    founder_cta_url: row.founder_cta_url,
    gallery_eyebrow: row.gallery_eyebrow,
    gallery_title: row.gallery_title,
    gallery_subtitle: row.gallery_subtitle,
    font_pairing_key: row.font_pairing_key,
    heading_color: row.heading_color || DEFAULT_HEADING_COLOR,
    body_color: row.body_color || DEFAULT_BODY_COLOR,
  };
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-sans text-sm font-semibold text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-ink/50">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  'w-full border border-ink/15 px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none';
const textareaClass = `${inputClass} min-h-[140px] leading-relaxed`;

export function AboutPageForm({ initial }: { initial: AboutPageRow }) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<AboutPageFormValues>(toFormValues(initial));
  const [saving, setSaving] = useState(false);

  function set<K extends keyof AboutPageFormValues>(key: K, value: AboutPageFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const result = await updateAboutPage(values);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('About page saved — live on the site now.');
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section>
        <h2 className="font-display text-h4 font-semibold text-ink">Page Hero</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow">
            <input
              value={values.hero_eyebrow}
              onChange={(e) => set('hero_eyebrow', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Title">
            <input
              value={values.hero_title}
              onChange={(e) => set('hero_title', e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Subtitle">
              <textarea
                value={values.hero_subtitle}
                onChange={(e) => set('hero_subtitle', e.target.value)}
                className={`${inputClass} min-h-[80px]`}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <ImagePickerField
              label="Hero Background Image"
              value={values.hero_image_url}
              onChange={(url) => set('hero_image_url', url)}
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="border-t border-ink/10 pt-10">
        <h2 className="font-display text-h4 font-semibold text-ink">Our Story</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow">
            <input
              value={values.story_eyebrow}
              onChange={(e) => set('story_eyebrow', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Title">
            <input
              value={values.story_title}
              onChange={(e) => set('story_title', e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Story" hint="Separate paragraphs with a blank line.">
              <textarea
                value={values.story_body}
                onChange={(e) => set('story_body', e.target.value)}
                className={`${textareaClass} min-h-[220px]`}
              />
            </Field>
          </div>
        </div>

        <div className="mt-8">
          <p className="font-sans text-sm font-semibold text-ink">Typography</p>
          <p className="mt-1 text-xs text-ink/50">
            Applies to this Our Story section only — the rest of the page keeps the site’s
            standard type.
          </p>
          <div className="mt-3">
            <FontPickerField
              value={values.font_pairing_key}
              onChange={(key) => set('font_pairing_key', key)}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <ColorPickerField
            label="Heading Color"
            value={values.heading_color}
            onChange={(hex) => set('heading_color', hex)}
            previewText={values.story_title || 'How It All Began'}
            previewClassName="text-xl"
          />
          <ColorPickerField
            label="Body Color"
            value={values.body_color}
            onChange={(hex) => set('body_color', hex)}
            previewText="A warm, readable sentence from the story, shown in your chosen color."
          />
        </div>
      </section>

      {/* Founder */}
      <section className="border-t border-ink/10 pt-10">
        <h2 className="font-display text-h4 font-semibold text-ink">Founder&rsquo;s Message</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow">
            <input
              value={values.founder_eyebrow}
              onChange={(e) => set('founder_eyebrow', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Title">
            <input
              value={values.founder_title}
              onChange={(e) => set('founder_title', e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Message" hint="Separate paragraphs with a blank line.">
              <textarea
                value={values.founder_message}
                onChange={(e) => set('founder_message', e.target.value)}
                className={`${textareaClass} min-h-[220px]`}
              />
            </Field>
          </div>
          <Field label="Signature line">
            <input
              value={values.founder_signature}
              onChange={(e) => set('founder_signature', e.target.value)}
              className={inputClass}
            />
          </Field>
          <div />
          <Field label="Button label">
            <input
              value={values.founder_cta_label}
              onChange={(e) => set('founder_cta_label', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Button link" hint="Where “Watch the Full Message” should go — a URL, or # if there’s no video yet.">
            <input
              value={values.founder_cta_url}
              onChange={(e) => set('founder_cta_url', e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <ImagePickerField
              label="Founder Portrait"
              value={values.founder_image_url}
              onChange={(url) => set('founder_image_url', url)}
            />
          </div>
        </div>
      </section>

      {/* Gallery labels */}
      <section className="border-t border-ink/10 pt-10">
        <h2 className="font-display text-h4 font-semibold text-ink">Gallery Section Labels</h2>
        <p className="mt-1 text-xs text-ink/50">
          Manage the actual photos further down this page, in “Photo Gallery.”
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow">
            <input
              value={values.gallery_eyebrow}
              onChange={(e) => set('gallery_eyebrow', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Title">
            <input
              value={values.gallery_title}
              onChange={(e) => set('gallery_title', e.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Subtitle">
              <textarea
                value={values.gallery_subtitle}
                onChange={(e) => set('gallery_subtitle', e.target.value)}
                className={`${inputClass} min-h-[80px]`}
              />
            </Field>
          </div>
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-ink/10 bg-cream/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-gold px-8 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-navy transition-colors hover:bg-gold-light disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
