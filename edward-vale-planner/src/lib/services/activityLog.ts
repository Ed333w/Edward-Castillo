import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { ActivityLogEntry, EntityType } from '@/types/domain';

type Client = SupabaseClient<Database>;

function mapEntry(row: Database['public']['Tables']['activity_log']['Row']): ActivityLogEntry {
  return {
    id: row.id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    action: row.action,
    actor: row.actor,
    occurredAt: row.occurred_at,
    summary: row.summary,
  };
}

/** History for a single task/event, newest first — written only by DB triggers. */
export async function listActivityFor(
  supabase: Client,
  entityType: EntityType,
  entityId: string,
): Promise<ActivityLogEntry[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('occurred_at', { ascending: false });
  if (error) throw error;
  return data.map(mapEntry);
}
