'use client';

import { createContext, useContext } from 'react';
import type { Profile } from '@/types/domain';

const ProfileContext = createContext<Profile | null>(null);

/**
 * The active profile shown here always comes from the server-verified
 * Supabase session (resolved in `app/(app)/layout.tsx`), never from a
 * client-side toggle. This is what makes "who's using the app" trustworthy
 * for attribution instead of just a cosmetic label (spec §2/§26).
 */
export function ProfileProvider({ profile, children }: { profile: Profile; children: React.ReactNode }) {
  return <ProfileContext.Provider value={profile}>{children}</ProfileContext.Provider>;
}

export function useActiveProfile(): Profile {
  const profile = useContext(ProfileContext);
  if (!profile) throw new Error('useActiveProfile must be used within ProfileProvider');
  return profile;
}
