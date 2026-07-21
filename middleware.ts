import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Paths under /admin that must stay reachable while signed out — the
// sign-in page itself, the OAuth callback that completes sign-in, and the
// "you don't have access" screen shown to non-allowlisted accounts.
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/auth/callback', '/admin/unauthorized'];

// Gate #1 of 2 (session exists at all — the allowlist check happens in
// src/app/admin/layout.tsx, which has a full server client to query
// admin_users). This runs on every request to /admin/*, so a signed-out
// visitor is redirected before any admin page or Server Action executes —
// it does not depend on client-side UI hiding anything.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin') || PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
