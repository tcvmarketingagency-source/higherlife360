import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://higherlife360.org';

// Revalidate hourly rather than on every crawl request.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/vision`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/live`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/recording`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/branches`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/donate`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/join`, changeFrequency: 'monthly', priority: 0.9 },
  ];

  // Defensive: a Supabase hiccup here should degrade to the static routes
  // above, not fail sitemap generation (or the production build) entirely.
  try {
    const [{ data: sermons }, { data: branches }, { data: events }] = await Promise.all([
      supabase.from('sermons').select('id, published_at'),
      supabase.from('branches').select('id'),
      supabase.from('events').select('id, start_time'),
    ]);

    const sermonRoutes: MetadataRoute.Sitemap = (sermons ?? []).map((sermon) => ({
      url: `${baseUrl}/recording/${sermon.id}`,
      lastModified: sermon.published_at,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    const branchRoutes: MetadataRoute.Sitemap = (branches ?? []).map((branch) => ({
      url: `${baseUrl}/branches/${branch.id}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    const eventRoutes: MetadataRoute.Sitemap = (events ?? []).map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: event.start_time,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...sermonRoutes, ...branchRoutes, ...eventRoutes];
  } catch {
    return staticRoutes;
  }
}
