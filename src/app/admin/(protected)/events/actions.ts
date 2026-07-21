'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { EventInsert, EventUpdate } from '@/lib/database.types';

export async function createEvent(input: EventInsert): Promise<{ error: string | null }> {
  if (!input.title?.trim()) return { error: 'A title is required.' };
  if (!input.start_time) return { error: 'A start time is required.' };

  const supabase = await createClient();
  const { error } = await supabase.from('events').insert(input);

  if (error) return { error: 'Could not save the event — please try again.' };

  revalidatePath('/admin/events');
  revalidatePath('/admin');
  revalidatePath('/events');
  revalidatePath('/');
  return { error: null };
}

export async function updateEvent(
  id: string,
  input: EventUpdate
): Promise<{ error: string | null }> {
  if (input.title !== undefined && !input.title.trim()) return { error: 'A title is required.' };

  const supabase = await createClient();
  const { error, count } = await supabase
    .from('events')
    .update(input, { count: 'exact' })
    .eq('id', id);

  if (error || count === 0) {
    return { error: 'Could not save the event — please try again.' };
  }

  revalidatePath('/admin/events');
  revalidatePath('/admin');
  revalidatePath('/events');
  revalidatePath(`/events/${id}`);
  revalidatePath('/');
  return { error: null };
}

export async function deleteEvent(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) return { error: 'Could not delete the event — please try again.' };

  revalidatePath('/admin/events');
  revalidatePath('/admin');
  revalidatePath('/events');
  revalidatePath('/');
  return { error: null };
}
