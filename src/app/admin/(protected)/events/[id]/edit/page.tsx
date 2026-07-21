import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EventForm } from '../../EventForm';

export const metadata: Metadata = { title: 'Edit Event' };
export const dynamic = 'force-dynamic';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const [{ data: event }, { data: branches }] = await Promise.all([
    supabase.from('events').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('branches').select('*').order('name'),
  ]);

  if (!event) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink">Edit Event</h1>
      <div className="mt-8">
        <EventForm event={event} branches={branches ?? []} />
      </div>
    </div>
  );
}
