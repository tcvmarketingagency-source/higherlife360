import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill in your Supabase URL and publishable key (Settings > API).'
  );
}

// Cookie-bound server client — used in Server Components, Route Handlers,
// and Server Actions under src/app/admin. Reads/writes the user's Supabase
// auth session via Next's cookie store, so RLS policies (which check
// auth.jwt()) see the signed-in admin, not the anonymous public role.
//
// `setAll` is wrapped in try/catch because Server Components are only
// allowed to *read* cookies, not set them — that's fine here since
// middleware.ts refreshes the session cookie on every request anyway.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl!, supabasePublishableKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component render — safe to ignore.
        }
      },
    },
  });
}
