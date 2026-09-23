import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentProfile } from '@/lib/services/profiles';
import { ProfileProvider } from '@/components/providers/ProfileProvider';
import { AppShell } from '@/components/nav/AppShell';

// Every page under this group requires a real, server-verified session AND a
// matching `profiles` row (created only for allow-listed emails). This is
// the actual authorization boundary — independent of anything the client
// sends (spec §2, §25).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const profile = await getCurrentProfile(supabase);

  if (!profile) {
    redirect('/login');
  }

  return (
    <ProfileProvider profile={profile}>
      <AppShell>{children}</AppShell>
    </ProfileProvider>
  );
}
