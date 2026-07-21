import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Google redirects here with a `code` after the user approves sign-in.
// Exchanging it for a session is what actually signs them into Supabase —
// then we immediately check the admin_users allowlist before letting them
// anywhere near /admin, and sign back out if they're not on it.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        const { data: adminRecord } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', user.email)
          .maybeSingle();

        if (adminRecord) {
          return NextResponse.redirect(`${origin}/admin`);
        }
      }

      await supabase.auth.signOut();
      return NextResponse.redirect(`${origin}/admin/unauthorized`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login`);
}
