import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Next.js 16 renamed the "middleware" file convention to "proxy" — same
// runtime behavior, just a new file name/export.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and image optimization,
     * so the session cookie stays fresh on every navigation.
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons/).*)',
  ],
};
