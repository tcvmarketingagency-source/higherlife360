import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type AdminRecord = {
  email: string;
  name: string | null;
  role: string;
};

/**
 * Gate #2 of 2 (see middleware.ts for gate #1 — "is anyone signed in at
 * all"). This checks the signed-in Google account against the admin_users
 * allowlist. Relies on the "Admins can read their own row" RLS policy on
 * admin_users (email = auth.jwt() ->> 'email'), so a non-allowlisted
 * account simply gets zero rows back — it can never see whether *other*
 * emails are allowlisted.
 *
 * Called from src/app/admin/layout.tsx, which every admin page renders
 * through — so this runs before any admin page body or Server Action, on
 * the server, regardless of what the client-side UI shows or hides.
 */
export async function requireAdmin(): Promise<AdminRecord> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect('/admin/login');
  }

  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('email, name, role')
    .eq('email', user.email)
    .maybeSingle();

  if (!adminRecord) {
    // Not on the allowlist — sign them out (don't leave a dangling
    // authenticated-but-unauthorized Supabase session sitting in cookies)
    // and send them to the polite "no access" screen.
    await supabase.auth.signOut();
    redirect('/admin/unauthorized');
  }

  return adminRecord;
}
