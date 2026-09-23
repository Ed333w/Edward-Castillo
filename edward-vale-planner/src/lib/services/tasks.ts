import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Priority, Task, TaskStatus } from '@/types/domain';
import { sanitizeDescription, sanitizeTitle } from '@/lib/utils/sanitize';
import { taskInputSchema } from './schemas';
import { mapTask } from './mappers';

type Client = SupabaseClient<Database>;

export interface TaskInput {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  priority?: Priority;
  categoryId?: string | null;
  reminderMinutes?: number | null;
}

export async function listTasks(supabase: Client): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(mapTask);
}

/** Creates a task with just a title — every other field is optional and can
 * be filled in later (see spec §10: quick add must not force extra fields). */
export async function createTask(supabase: Client, input: TaskInput): Promise<Task> {
  const parsed = taskInputSchema.parse(input);
  const title = sanitizeTitle(parsed.title);

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      description: parsed.description ? sanitizeDescription(parsed.description) : null,
      due_date: parsed.dueDate ?? null,
      due_time: parsed.dueTime ?? null,
      priority: parsed.priority ?? 'medium',
      category_id: parsed.categoryId ?? null,
      reminder_minutes: parsed.reminderMinutes ?? null,
    })
    // created_by / updated_by / timestamps are set server-side by triggers —
    // never sent from the client.
    .select('*')
    .single();
  if (error) throw error;
  return mapTask(data);
}

export async function updateTask(
  supabase: Client,
  id: string,
  patch: Partial<TaskInput & { status: TaskStatus }>,
): Promise<Task> {
  const update: Database['public']['Tables']['tasks']['Update'] = {};
  if (patch.title !== undefined) update.title = sanitizeTitle(patch.title);
  if (patch.description !== undefined) {
    update.description = patch.description ? sanitizeDescription(patch.description) : null;
  }
  if (patch.dueDate !== undefined) update.due_date = patch.dueDate;
  if (patch.dueTime !== undefined) update.due_time = patch.dueTime;
  if (patch.priority !== undefined) update.priority = patch.priority;
  if (patch.categoryId !== undefined) update.category_id = patch.categoryId;
  if (patch.reminderMinutes !== undefined) update.reminder_minutes = patch.reminderMinutes;
  if (patch.status !== undefined) update.status = patch.status;

  const { data, error } = await supabase.from('tasks').update(update).eq('id', id).select('*').single();
  if (error) throw error;
  return mapTask(data);
}

export async function setTaskStatus(supabase: Client, id: string, status: TaskStatus): Promise<Task> {
  return updateTask(supabase, id, { status });
}

export async function deleteTask(supabase: Client, id: string): Promise<void> {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}
