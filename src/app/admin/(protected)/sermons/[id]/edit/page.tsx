import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SermonForm } from '../../SermonForm';

export const metadata: Metadata = { title: 'Edit Sermon' };
export const dynamic = 'force-dynamic';

export default async function EditSermonPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: sermon } = await supabase
    .from('sermons')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();

  if (!sermon) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 font-semibold text-ink">Edit Sermon</h1>
      <div className="mt-8">
        <SermonForm sermon={sermon} />
      </div>
    </div>
  );
}
