import { z } from 'zod';

/**
 * Defense-in-depth validation at the service boundary (spec §27) — the real
 * enforcement is the CHECK constraints in supabase/schema.sql, but failing
 * fast here gives the UI a clear, specific error instead of a raw Postgres
 * error message.
 */

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha inválida.');
const timeStr = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora inválida.');
const priority = z.enum(['low', 'medium', 'high']);
const reminderMinutes = z.number().int().min(0).max(43_200); // up to 30 days

export const taskInputSchema = z.object({
  title: z.string().trim().min(1, 'El título no puede estar vacío.').max(200),
  description: z.string().max(2000).nullish(),
  dueDate: dateStr.nullish(),
  dueTime: timeStr.nullish(),
  priority: priority.optional(),
  categoryId: z.string().uuid().nullish(),
  reminderMinutes: reminderMinutes.nullish(),
});

export const eventInputSchema = z.object({
  title: z.string().trim().min(1, 'El título no puede estar vacío.').max(200),
  description: z.string().max(2000).nullish(),
  startDate: dateStr,
  startTime: timeStr.nullish(),
  endDate: dateStr.nullish(),
  endTime: timeStr.nullish(),
  allDay: z.boolean().optional(),
  categoryId: z.string().uuid().nullish(),
  reminderMinutes: reminderMinutes.nullish(),
});

export const categoryNameSchema = z.string().trim().min(1, 'El nombre no puede estar vacío.').max(60);
