import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AboutPageForm } from './AboutPageForm';
import { GalleryManager } from './GalleryManager';
import type { AboutPageRow } from '@/lib/database.types';

export const metadata: Metadata = { title: 'About Page' };
export const dynamic = 'force-dynamic';

const FALLBACK_ROW: AboutPageRow = {
  id: '',
  singleton: true,
  hero_eyebrow: '',
  hero_title: '',
  hero_subtitle: '',
  hero_image_url: null,
  story_eyebrow: '',
  story_title: '',
  story_body: '',
  founder_eyebrow: '',
  founder_title: '',
  founder_message: '',
  founder_signature: '',
  founder_image_url: null,
  founder_cta_label: '',
  founder_cta_url: '#',
  gallery_eyebrow: '',
  gallery_title: '',
  gallery_subtitle: '',
  font_pairing_key: 'heritage-serif',
  heading_color: '#0F1523',
  body_color: '#2B2B2B',
  updated_at: '',
};

export default async function AdminAboutPage() {
  const supabase = await createClient();

  const [{ data: aboutRow }, { data: gallery }] = await Promise.all([
    supabase.from('about_page').select('*').eq('singleton', true).maybeSingle(),
    supabase.from('about_gallery').select('*').order('sort_order', { ascending: true }),
  ]);

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink">About Page</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        Manage everything on the public About Us page — text, images, gallery photos, and the Our
        Story section&rsquo;s typography and color. Changes go live immediately.
      </p>

      {!aboutRow && (
        <p className="mt-6 max-w-2xl border border-gold-deep/30 bg-gold-deep/5 p-4 text-sm text-ink/80">
          The About page table hasn&rsquo;t been set up in the database yet — run{' '}
          <code className="font-mono text-xs">supabase/about-schema.sql</code> in the Supabase SQL
          Editor, then refresh this page.
        </p>
      )}

      <div className="mt-8">
        <AboutPageForm initial={aboutRow ?? FALLBACK_ROW} />
      </div>

      <section className="mt-16 border-t border-ink/10 pt-10">
        <h2 className="font-display text-h4 font-semibold text-ink">Photo Gallery</h2>
        <p className="mt-1 text-sm text-ink/70">
          Add, reorder, and remove the photos shown in the About page&rsquo;s gallery section.
        </p>
        <div className="mt-6">
          <GalleryManager initialPhotos={gallery ?? []} />
        </div>
      </section>
    </div>
  );
}
