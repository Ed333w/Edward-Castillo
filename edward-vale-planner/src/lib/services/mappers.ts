import type { Database } from '@/types/database';
import type { CalendarEvent, Category, Profile, Task } from '@/types/domain';

type TaskRow = Database['public']['Tables']['tasks']['Row'];
type EventRow = Database['public']['Tables']['calendar_events']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    dueTime: row.due_time,
    priority: row.priority,
    categoryId: row.category_id,
    status: row.status,
    reminderMinutes: row.reminder_minutes,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapEvent(row: EventRow): CalendarEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    startDate: row.start_date,
    startTime: row.start_time,
    endDate: row.end_date,
    endTime: row.end_time,
    allDay: row.all_day,
    categoryId: row.category_id,
    reminderMinutes: row.reminder_minutes,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    displayName: row.display_name,
    email: row.email,
  };
}
