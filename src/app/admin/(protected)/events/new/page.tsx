import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { EventForm } from '../EventForm';

export const metadata: Metadata = { title: 'Add Event' };
export const dynamic = 'force-dynamic';

export default async function NewEventPage() {
  const supabase = await createClient();
  const { data: branches } = await supabase.from('branches').select('*').order('name');

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink">Add Event</h1>
      <div className="mt-8">
        <EventForm branches={branches ?? []} />
      </div>
    </div>
  );
}
