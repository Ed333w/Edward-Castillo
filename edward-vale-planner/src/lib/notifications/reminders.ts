import type { CalendarItem } from '@/types/domain';
import { combineDateTime } from '@/lib/utils/dates';

/**
 * "Basic level" reminders (spec §17): fire a browser Notification while this
 * tab is open. This does NOT work once the app/tab is closed — that requires
 * the Web Push + Service Worker + Edge Function path in `push.ts` and
 * `supabase/functions/send-reminders`.
 */

const CHECK_INTERVAL_MS = 30_000;
const alreadyFired = new Set<string>();

export function computeReminderTime(item: CalendarItem, reminderMinutes: number): Date | null {
  if (!item.time) return null; // an all-day item has no precise instant to count back from
  const target = combineDateTime(item.date, item.time);
  return new Date(target.getTime() - reminderMinutes * 60_000);
}

function notify(item: CalendarItem) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const key = `${item.kind}:${item.id}`;
  if (alreadyFired.has(key)) return;
  alreadyFired.add(key);

  const kindLabel = item.kind === 'task' ? 'Tarea' : 'Evento';
  new Notification(`${kindLabel}: ${item.title}`, {
    body: item.time ? `Hoy a las ${item.time}` : 'Hoy',
    tag: key,
  });
}

/**
 * Starts a lightweight polling loop that checks upcoming items with a
 * reminder configured and fires a Notification when their reminder time is
 * reached. Call the returned function to stop.
 */
export function startReminderWatcher(getItems: () => Array<{ item: CalendarItem; reminderMinutes: number | null }>) {
  const tick = () => {
    const now = Date.now();
    for (const { item, reminderMinutes } of getItems()) {
      if (reminderMinutes === null || item.completed) continue;
      const fireAt = computeReminderTime(item, reminderMinutes);
      if (!fireAt) continue;
      if (fireAt.getTime() <= now && now - fireAt.getTime() < 5 * CHECK_INTERVAL_MS) {
        notify(item);
      }
    }
  };

  tick();
  const handle = setInterval(tick, CHECK_INTERVAL_MS);
  return () => clearInterval(handle);
}
