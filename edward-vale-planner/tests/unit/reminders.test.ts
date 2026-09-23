import { describe, expect, it } from 'vitest';
import { computeReminderTime } from '@/lib/notifications/reminders';
import type { CalendarItem } from '@/types/domain';

function makeItem(overrides: Partial<CalendarItem> = {}): CalendarItem {
  return {
    id: 'i1',
    kind: 'event',
    title: 'Reunión',
    date: '2026-09-25',
    time: '10:00',
    endDate: null,
    endTime: null,
    allDay: false,
    completed: false,
    priority: null,
    categoryId: null,
    createdBy: 'edward-id',
    ...overrides,
  };
}

describe('computeReminderTime', () => {
  it('returns null for an all-day item with no time to count back from', () => {
    expect(computeReminderTime(makeItem({ time: null }), 30)).toBeNull();
  });

  it('subtracts the reminder minutes from the item time', () => {
    const result = computeReminderTime(makeItem({ time: '10:00' }), 30);
    expect(result?.getHours()).toBe(9);
    expect(result?.getMinutes()).toBe(30);
  });

  it('fires exactly at the item time when reminderMinutes is 0 ("a la hora")', () => {
    const result = computeReminderTime(makeItem({ time: '10:00' }), 0);
    expect(result?.getHours()).toBe(10);
    expect(result?.getMinutes()).toBe(0);
  });
});
