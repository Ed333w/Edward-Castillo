import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Either no code, or the exchange failed (e.g. the trigger rejected a
  // non-allow-listed email during sign-up) — send back to login with a
  // generic error, never a stack trace or internal detail.
  return NextResponse.redirect(`${origin}/login?error=not_allowed`);
}
