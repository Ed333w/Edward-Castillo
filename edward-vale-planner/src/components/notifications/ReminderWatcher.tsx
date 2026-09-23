'use client';

import { useEffect } from 'react';
import { usePlannerData } from '@/hooks/usePlannerData';
import { mergeCalendarItems } from '@/lib/utils/merge';
import { startReminderWatcher } from '@/lib/notifications/reminders';
import type { Task, CalendarEvent } from '@/types/domain';

/**
 * Mounted once in the app shell so "basic level" reminders (spec §17) fire
 * from any screen, not just the dashboard, as long as this tab stays open.
 */
export function ReminderWatcher() {
  const { tasks, events } = usePlannerData();

  useEffect(() => {
    const stop = startReminderWatcher(() => buildReminderCandidates(tasks, events));
    return stop;
  }, [tasks, events]);

  return null;
}

function buildReminderCandidates(tasks: Task[], events: CalendarEvent[]) {
  const items = mergeCalendarItems(tasks, events);
  const reminderById = new Map<string, number | null>();
  for (const t of tasks) reminderById.set(`task:${t.id}`, t.reminderMinutes);
  for (const e of events) reminderById.set(`event:${e.id}`, e.reminderMinutes);

  return items.map((item) => ({ item, reminderMinutes: reminderById.get(`${item.kind}:${item.id}`) ?? null }));
}
