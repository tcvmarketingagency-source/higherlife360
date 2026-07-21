import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill in your Supabase URL and publishable key (Settings > API).'
  );
}

// Session-aware browser client — used only inside 'use client' admin
// components (sign-in, media library uploads). The public site's data
// fetching keeps using the plain client in src/lib/supabase.ts; this one
// additionally persists the user's auth session in cookies so the server
// (middleware, layouts, Server Actions) can read it on the next request.
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl!, supabasePublishableKey!);
}
