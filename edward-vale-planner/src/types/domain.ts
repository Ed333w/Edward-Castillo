import type { ActivityAction, EntityType, Priority, TaskStatus } from './database';

export type { Priority, TaskStatus, EntityType, ActivityAction };

export interface Profile {
  id: string;
  displayName: 'Edward' | 'Vale';
  email: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  createdBy: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null; // 'YYYY-MM-DD'
  dueTime: string | null; // 'HH:mm[:ss]'
  priority: Priority;
  categoryId: string | null;
  status: TaskStatus;
  reminderMinutes: number | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  startTime: string | null;
  endDate: string | null;
  endTime: string | null;
  allDay: boolean;
  categoryId: string | null;
  reminderMinutes: number | null;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogEntry {
  id: string;
  entityType: EntityType;
  entityId: string;
  action: ActivityAction;
  actor: string;
  occurredAt: string;
  summary: string | null;
}

/**
 * Unified shape used by the calendar UI so it can render tasks-with-a-date
 * and real events on the same grid without ever creating a duplicate row.
 * `kind` tells the UI (and click handler) which table/form to use.
 */
export interface CalendarItem {
  id: string;
  kind: 'task' | 'event';
  title: string;
  date: string;
  time: string | null;
  endDate: string | null;
  endTime: string | null;
  allDay: boolean;
  completed: boolean;
  priority: Priority | null;
  categoryId: string | null;
  createdBy: string;
}

export const REMINDER_OPTIONS = [
  { value: null, label: 'Sin recordatorio' },
  { value: 0, label: 'A la hora' },
  { value: 5, label: '5 minutos antes' },
  { value: 10, label: '10 minutos antes' },
  { value: 30, label: '30 minutos antes' },
  { value: 60, label: '1 hora antes' },
  { value: 1440, label: '1 día antes' },
] as const;

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completada',
};
