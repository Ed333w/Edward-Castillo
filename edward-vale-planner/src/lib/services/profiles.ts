import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Profile } from '@/types/domain';
import { mapProfile } from './mappers';

type Client = SupabaseClient<Database>;

export async function getCurrentProfile(supabase: Client): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
  if (error) throw error;
  return data ? mapProfile(data) : null;
}

/** Both profiles — used to resolve createdBy/updatedBy ids to display names. */
export async function listProfiles(supabase: Client): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw error;
  return data.map(mapProfile);
}
