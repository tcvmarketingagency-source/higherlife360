'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/ToastProvider';
import { deleteSermon } from './actions';
import type { SermonRow } from '@/lib/database.types';

type SortKey = 'published_at' | 'title' | 'speaker';

export function SermonsTable({ sermons }: { sermons: SermonRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('published_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = sermons.filter((s) => {
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        (s.speaker ?? '').toLowerCase().includes(q) ||
        (s.series ?? '').toLowerCase().includes(q)
      );
    });

    return [...result].sort((a, b) => {
      const av = (a[sortKey] ?? '').toString();
      const bv = (b[sortKey] ?? '').toString();
      const cmp = av.localeCompare(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sermons, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteSermon(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Sermon deleted.');
      router.refresh();
    }
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, speaker, or series…"
        className="w-full max-w-sm border border-ink/20 bg-white px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
      />

      <div className="mt-4 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-widest text-ink/60">
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('title')}>
                Title
              </th>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('speaker')}>
                Speaker
              </th>
              <th className="px-4 py-3">Series</th>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('published_at')}>
                Published
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((sermon) => (
              <tr key={sermon.id} className="border-b border-ink/10 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{sermon.title}</td>
                <td className="px-4 py-3 text-ink/70">{sermon.speaker ?? '—'}</td>
                <td className="px-4 py-3 text-ink/70">{sermon.series ?? '—'}</td>
                <td className="px-4 py-3 text-ink/70">
                  {new Date(sermon.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/admin/sermons/${sermon.id}/edit`}
                      className="text-xs font-semibold uppercase tracking-widest text-navy-elevated hover:text-gold-deep"
                    >
                      Edit
                    </Link>
                    <ConfirmDialog
                      triggerLabel="Delete"
                      title="Delete this sermon?"
                      description={`"${sermon.title}" will be permanently removed and will disappear from the site immediately.`}
                      onConfirm={() => handleDelete(sermon.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/60">
                  No sermons match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
