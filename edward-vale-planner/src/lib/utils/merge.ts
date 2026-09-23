import type { CalendarEvent, CalendarItem, Task } from '@/types/domain';

/**
 * Builds the unified list the calendar renders. A task with a due date is
 * NEVER copied into a separate `calendar_events` row (spec §9) — it is
 * projected into a `CalendarItem` on the fly here, so editing/deleting the
 * task is automatically reflected on the calendar with no extra sync logic.
 */
export function mergeCalendarItems(tasks: Task[], events: CalendarEvent[]): CalendarItem[] {
  const fromTasks: CalendarItem[] = tasks
    .filter((t) => t.dueDate !== null)
    .map((t) => ({
      id: t.id,
      kind: 'task',
      title: t.title,
      date: t.dueDate as string,
      time: t.dueTime,
      endDate: null,
      endTime: null,
      allDay: !t.dueTime,
      completed: t.status === 'completed',
      priority: t.priority,
      categoryId: t.categoryId,
      createdBy: t.createdBy,
    }));

  const fromEvents: CalendarItem[] = events.map((e) => ({
    id: e.id,
    kind: 'event',
    title: e.title,
    date: e.startDate,
    time: e.startTime,
    endDate: e.endDate,
    endTime: e.endTime,
    allDay: e.allDay,
    completed: false,
    priority: null,
    categoryId: e.categoryId,
    createdBy: e.createdBy,
  }));

  return [...fromTasks, ...fromEvents].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    if (a.time === b.time) return 0;
    if (a.time === null) return -1;
    if (b.time === null) return 1;
    return a.time < b.time ? -1 : 1;
  });
}

export function itemsForDate(items: CalendarItem[], dateKey: string): CalendarItem[] {
  return items.filter((i) => i.date === dateKey);
}
