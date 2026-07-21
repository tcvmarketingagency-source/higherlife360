import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { EventsTable } from './EventsTable';

export const metadata: Metadata = { title: 'Events' };
export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const [{ data: events }, { data: branches }] = await Promise.all([
    supabase.from('events').select('*').order('start_time', { ascending: true }),
    supabase.from('branches').select('id, name'),
  ]);

  const branchNameById = new Map((branches ?? []).map((b) => [b.id, b.name]));
  const eventsWithBranch = (events ?? []).map((event) => ({
    ...event,
    branchName: event.branch_id ? (branchNameById.get(event.branch_id) ?? null) : null,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 font-semibold text-ink">Events</h1>
          <p className="mt-1 text-sm text-ink/70">{eventsWithBranch.length} total</p>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-gold px-6 py-2.5 font-sans text-sm font-medium uppercase tracking-widest text-navy transition-colors hover:bg-gold-light"
        >
          + Add Event
        </Link>
      </div>

      <div className="mt-8">
        <EventsTable events={eventsWithBranch} />
      </div>
    </div>
  );
}
