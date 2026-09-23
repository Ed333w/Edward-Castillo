import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';
import { buildCsp } from './csp';

const PUBLIC_PATHS = ['/login', '/auth/callback'];

/**
 * Refreshes the Supabase auth session on every request, gates access to the
 * app, and attaches a per-request Content-Security-Policy with a nonce
 * (spec §33). Route protection happens here — before any page/route handler
 * runs — so it does not depend on client-side checks a manipulated frontend
 * could skip.
 */
export async function updateSession(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request: { headers: requestHeaders } });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));

  if (!user && !isPublic && path !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    response = NextResponse.redirect(url);
  } else if (user && path === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    response = NextResponse.redirect(url);
  }

  response.headers.set('Content-Security-Policy', csp);
  return response;
}
