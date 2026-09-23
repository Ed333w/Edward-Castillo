import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { CalendarEvent } from '@/types/domain';
import { sanitizeDescription, sanitizeTitle } from '@/lib/utils/sanitize';
import { eventInputSchema } from './schemas';
import { mapEvent } from './mappers';

type Client = SupabaseClient<Database>;

export interface EventInput {
  title: string;
  description?: string | null;
  startDate: string;
  startTime?: string | null;
  endDate?: string | null;
  endTime?: string | null;
  allDay?: boolean;
  categoryId?: string | null;
  reminderMinutes?: number | null;
}

export async function listEvents(supabase: Client): Promise<CalendarEvent[]> {
  const { data, error } = await supabase.from('calendar_events').select('*').order('start_date', { ascending: true });
  if (error) throw error;
  return data.map(mapEvent);
}

export async function listEventsInRange(supabase: Client, fromDate: string, toDate: string): Promise<CalendarEvent[]> {
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .gte('start_date', fromDate)
    .lte('start_date', toDate)
    .order('start_date', { ascending: true });
  if (error) throw error;
  return data.map(mapEvent);
}

export async function createEvent(supabase: Client, input: EventInput): Promise<CalendarEvent> {
  const parsed = eventInputSchema.parse(input);
  const title = sanitizeTitle(parsed.title);

  const { data, error } = await supabase
    .from('calendar_events')
    .insert({
      title,
      description: parsed.description ? sanitizeDescription(parsed.description) : null,
      start_date: parsed.startDate,
      start_time: parsed.allDay ? null : parsed.startTime ?? null,
      end_date: parsed.endDate ?? null,
      end_time: parsed.allDay ? null : parsed.endTime ?? null,
      all_day: parsed.allDay ?? false,
      category_id: parsed.categoryId ?? null,
      reminder_minutes: parsed.reminderMinutes ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapEvent(data);
}

export async function updateEvent(supabase: Client, id: string, patch: Partial<EventInput>): Promise<CalendarEvent> {
  const update: Database['public']['Tables']['calendar_events']['Update'] = {};
  if (patch.title !== undefined) update.title = sanitizeTitle(patch.title);
  if (patch.description !== undefined) {
    update.description = patch.description ? sanitizeDescription(patch.description) : null;
  }
  if (patch.startDate !== undefined) update.start_date = patch.startDate;
  if (patch.startTime !== undefined) update.start_time = patch.startTime;
  if (patch.endDate !== undefined) update.end_date = patch.endDate;
  if (patch.endTime !== undefined) update.end_time = patch.endTime;
  if (patch.allDay !== undefined) update.all_day = patch.allDay;
  if (patch.categoryId !== undefined) update.category_id = patch.categoryId;
  if (patch.reminderMinutes !== undefined) update.reminder_minutes = patch.reminderMinutes;

  const { data, error } = await supabase.from('calendar_events').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapEvent(data);
}

export async function deleteEvent(supabase: Client, id: string): Promise<void> {
  const { error } = await supabase.from('calendar_events').delete().eq('id', id);
  if (error) throw error;
}
