'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/ToastProvider';
import { deleteEvent } from './actions';
import type { EventRow } from '@/lib/database.types';

type EventWithBranch = EventRow & { branchName: string | null };

function EventRowsTable({
  events,
  onDelete,
}: {
  events: EventWithBranch[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto border border-ink/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 text-xs uppercase tracking-widest text-ink/60">
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Branch</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-ink/10 last:border-0">
              <td className="px-4 py-3 font-medium text-ink">{event.title}</td>
              <td className="px-4 py-3 text-ink/70">{event.branchName ?? '—'}</td>
              <td className="px-4 py-3 text-ink/70">{event.category ?? '—'}</td>
              <td className="px-4 py-3 text-ink/70">
                {new Date(event.start_time).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-xs font-semibold uppercase tracking-widest text-navy-elevated hover:text-gold-deep"
                  >
                    Edit
                  </Link>
                  <ConfirmDialog
                    triggerLabel="Delete"
                    title="Delete this event?"
                    description={`"${event.title}" will be permanently removed and will disappear from the site immediately.`}
                    onConfirm={() => onDelete(event.id)}
                  />
                </div>
              </td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-ink/60">
                Nothing here.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function EventsTable({ events }: { events: EventWithBranch[] }) {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.category ?? '').toLowerCase().includes(q) ||
        (e.branchName ?? '').toLowerCase().includes(q)
    );
  }, [events, query]);

  const now = Date.now();
  const upcoming = filtered
    .filter((e) => new Date(e.start_time).getTime() >= now)
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  const past = filtered
    .filter((e) => new Date(e.start_time).getTime() < now)
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());

  async function handleDelete(id: string) {
    const result = await deleteEvent(id);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Event deleted.');
      router.refresh();
    }
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title, branch, or category…"
        className="w-full max-w-sm border border-ink/20 bg-white px-4 py-2.5 font-sans text-sm text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
      />

      <div className="mt-6">
        <h2 className="font-display text-h4 font-semibold text-ink">
          Upcoming <span className="text-ink/50">({upcoming.length})</span>
        </h2>
        <div className="mt-3">
          <EventRowsTable events={upcoming} onDelete={handleDelete} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-h4 font-semibold text-ink">
          Past <span className="text-ink/50">({past.length})</span>
        </h2>
        <div className="mt-3">
          <EventRowsTable events={past} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
