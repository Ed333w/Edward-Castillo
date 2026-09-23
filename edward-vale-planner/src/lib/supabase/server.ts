import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Server-side Supabase client for use in Server Components, Route Handlers
 * and Server Actions. Reads/writes the auth cookie via Next.js `cookies()`.
 * Still only uses the anon key — authorization is enforced by RLS.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component that can't set cookies — the
            // middleware below is responsible for keeping the session fresh.
          }
        },
      },
    },
  );
}
