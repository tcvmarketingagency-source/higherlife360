import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Dashboard' };

function StatCard({ label, value, href }: { label: string; value: number | string; href: string }) {
  return (
    <Link
      href={href}
      className="block border border-ink/10 bg-white p-6 transition-colors hover:border-gold"
    >
      <p className="font-sans text-xs uppercase tracking-widest text-ink/60">{label}</p>
      <p className="mt-2 font-display text-h2 font-semibold text-ink">{value}</p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [sermonsCountRes, upcomingEventsCountRes, sermonsRecentRes, imagesRecentRes, mediaListRes] =
    await Promise.all([
      supabase.from('sermons').select('id', { count: 'exact', head: true }),
      supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .gte('start_time', new Date().toISOString()),
      supabase
        .from('sermons')
        .select('id, title, published_at')
        .order('published_at', { ascending: false })
        .limit(5),
      supabase
        .from('site_images')
        .select('id, label, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5),
      supabase.storage.from('site-media').list('', { limit: 1000 }),
    ]);

  const sermonsCount = sermonsCountRes.count ?? 0;
  const upcomingEventsCount = upcomingEventsCountRes.count ?? 0;
  const imagesCount = mediaListRes.data?.length ?? 0;

  const activity = [
    ...(sermonsRecentRes.data ?? []).map((s) => ({
      key: `sermon-${s.id}`,
      text: `Sermon added: "${s.title}"`,
      at: s.published_at,
    })),
    ...(imagesRecentRes.data ?? []).map((i) => ({
      key: `image-${i.id}`,
      text: `Site image updated: ${i.label}`,
      at: i.updated_at,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink">Dashboard</h1>
      <p className="mt-2 text-sm text-ink/70">A quick look at what&rsquo;s on the site right now.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <StatCard label="Total Sermons" value={sermonsCount} href="/admin/sermons" />
        <StatCard label="Upcoming Events" value={upcomingEventsCount} href="/admin/events" />
        <StatCard label="Images Uploaded" value={imagesCount} href="/admin/media" />
      </div>

      <div className="mt-10">
        <h2 className="font-display text-h4 font-semibold text-ink">Recent Activity</h2>
        <div className="mt-4 divide-y divide-ink/10 border border-ink/10 bg-white">
          {activity.length > 0 ? (
            activity.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 px-5 py-3">
                <p className="text-sm text-ink">{item.text}</p>
                <p className="flex-shrink-0 text-xs uppercase tracking-widest text-ink/50">
                  {new Date(item.at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            ))
          ) : (
            <p className="px-5 py-6 text-sm text-ink/60">
              No activity yet — add a sermon or replace a site image to see it here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
