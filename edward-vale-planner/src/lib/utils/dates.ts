import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  parse,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * All dates are stored and compared as local calendar dates/times
 * ('YYYY-MM-DD' / 'HH:mm'), never converted through UTC. This avoids the
 * classic "event shows one day off" bug — a date like a birthday or a
 * deadline means the same calendar day everywhere, so we never let the
 * browser's UTC offset shift it.
 */

export function todayLocalDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function nowLocalTime(): string {
  return format(new Date(), 'HH:mm');
}

export function parseLocalDate(dateStr: string): Date {
  return parse(dateStr, 'yyyy-MM-dd', new Date());
}

export function combineDateTime(dateStr: string, timeStr: string | null): Date {
  if (!timeStr) return parseLocalDate(dateStr);
  return parse(`${dateStr} ${timeStr.slice(0, 5)}`, 'yyyy-MM-dd HH:mm', new Date());
}

export function formatFriendlyDate(dateStr: string): string {
  return format(parseLocalDate(dateStr), "EEEE d 'de' MMMM", { locale: es });
}

export function formatShortDate(dateStr: string): string {
  return format(parseLocalDate(dateStr), 'd MMM', { locale: es });
}

export function formatTime(timeStr: string | null): string | null {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return format(d, 'h:mm a');
}

/** True when a pending item's date/time has already passed. */
export function isOverdue(dateStr: string | null, timeStr: string | null, status: string): boolean {
  if (!dateStr || status === 'completed') return false;
  const target = combineDateTime(dateStr, timeStr ?? '23:59');
  return isBefore(target, new Date());
}

export function isToday(dateStr: string): boolean {
  return isSameDay(parseLocalDate(dateStr), new Date());
}

export function weekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** 6x7 grid of days covering the full month view, including leading/trailing days. */
export function monthGrid(anchor: Date): Date[] {
  const monthStart = startOfMonth(anchor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthEnd = endOfMonth(anchor);
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let cursor = gridStart;
  while (!isBeforeOrSame(gridEnd, cursor)) {
    days.push(cursor);
    cursor = addDays(cursor, 1);
  }
  return days;
}

function isBeforeOrSame(a: Date, b: Date) {
  return isBefore(a, b);
}

export function isCurrentMonth(day: Date, anchor: Date): boolean {
  return isSameMonth(day, anchor);
}

export function toDateKey(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

export function shiftMonth(anchor: Date, delta: number): Date {
  return addMonths(anchor, delta);
}

export function shiftWeek(anchor: Date, delta: number): Date {
  return addDays(anchor, delta * 7);
}

export function shiftDay(anchor: Date, delta: number): Date {
  return addDays(anchor, delta);
}

export const REMINDER_MINUTES_LABELS: Record<number, string> = {
  0: 'a la hora',
  5: '5 min antes',
  10: '10 min antes',
  30: '30 min antes',
  60: '1 hora antes',
  1440: '1 día antes',
};
