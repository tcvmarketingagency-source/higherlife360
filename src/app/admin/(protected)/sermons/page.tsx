import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SermonsTable } from './SermonsTable';

export const metadata: Metadata = { title: 'Sermons' };
export const dynamic = 'force-dynamic';

export default async function AdminSermonsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('sermons')
    .select('*')
    .order('published_at', { ascending: false });

  const sermons = data ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 font-semibold text-ink">Sermons</h1>
          <p className="mt-1 text-sm text-ink/70">{sermons.length} total</p>
        </div>
        <Link
          href="/admin/sermons/new"
          className="bg-gold px-6 py-2.5 font-sans text-sm font-medium uppercase tracking-widest text-navy transition-colors hover:bg-gold-light"
        >
          + Add Sermon
        </Link>
      </div>

      <div className="mt-8">
        <SermonsTable sermons={sermons} />
      </div>
    </div>
  );
}
