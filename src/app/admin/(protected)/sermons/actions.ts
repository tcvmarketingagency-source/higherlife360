'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { SermonInsert, SermonUpdate } from '@/lib/database.types';

// Every mutation re-checks admin status at the database layer via RLS's
// is_admin() (see supabase/admin-schema.sql) — if the insert/update/delete
// below silently affects zero rows, it's because RLS rejected it, which we
// surface as a friendly error rather than a raw Postgres message.

export async function createSermon(input: SermonInsert): Promise<{ error: string | null }> {
  if (!input.title?.trim()) return { error: 'A title is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('sermons').insert(input);

  if (error) return { error: 'Could not save the sermon — please try again.' };

  revalidatePath('/admin/sermons');
  revalidatePath('/admin');
  revalidatePath('/recording');
  revalidatePath('/');
  return { error: null };
}

export async function updateSermon(
  id: string,
  input: SermonUpdate
): Promise<{ error: string | null }> {
  if (input.title !== undefined && !input.title.trim()) return { error: 'A title is required.' };

  const supabase = await createClient();
  const { error, count } = await supabase
    .from('sermons')
    .update(input, { count: 'exact' })
    .eq('id', id);

  if (error || count === 0) {
    return { error: 'Could not save the sermon — please try again.' };
  }

  revalidatePath('/admin/sermons');
  revalidatePath('/admin');
  revalidatePath('/recording');
  revalidatePath(`/recording/${id}`);
  revalidatePath('/');
  return { error: null };
}

export async function deleteSermon(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from('sermons').delete().eq('id', id);

  if (error) return { error: 'Could not delete the sermon — please try again.' };

  revalidatePath('/admin/sermons');
  revalidatePath('/admin');
  revalidatePath('/recording');
  revalidatePath('/');
  return { error: null };
}
