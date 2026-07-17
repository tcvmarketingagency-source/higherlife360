import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Supabase now calls this a "publishable key" (format: sb_publishable_...) instead
// of the legacy JWT-based "anon key" — it is used identically, in the same slot.
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill in your Supabase URL and publishable key (Settings > API).'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey);
