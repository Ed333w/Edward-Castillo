import { describe, expect, it } from 'vitest';
import { mergeCalendarItems, itemsForDate } from '@/lib/utils/merge';
import type { CalendarEvent, Task } from '@/types/domain';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'Entregar laboratorio',
    description: null,
    dueDate: '2026-09-25',
    dueTime: '23:59',
    priority: 'medium',
    categoryId: null,
    status: 'pending',
    reminderMinutes: null,
    createdBy: 'vale-id',
    updatedBy: null,
    createdAt: '2026-09-20T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
    ...overrides,
  };
}

function makeEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    id: 'e1',
    title: 'Reunión',
    description: null,
    startDate: '2026-09-25',
    startTime: '10:00',
    endDate: null,
    endTime: null,
    allDay: false,
    categoryId: null,
    reminderMinutes: null,
    createdBy: 'edward-id',
    updatedBy: null,
    createdAt: '2026-09-20T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
    ...overrides,
  };
}

describe('mergeCalendarItems', () => {
  it('projects a task with a due date onto the calendar', () => {
    const items = mergeCalendarItems([makeTask()], []);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ kind: 'task', id: 't1', date: '2026-09-25' });
  });

  it('never shows a task without a due date on the calendar (spec §8/§9)', () => {
    const items = mergeCalendarItems([makeTask({ dueDate: null, dueTime: null })], []);
    expect(items).toHaveLength(0);
  });

  it('includes real calendar events alongside projected tasks', () => {
    const items = mergeCalendarItems([makeTask()], [makeEvent()]);
    expect(items).toHaveLength(2);
    expect(items.map((i) => i.kind).sort()).toEqual(['event', 'task']);
  });

  it('reflects a task edit immediately: no separate stored copy to go stale', () => {
    const original = makeTask({ dueDate: '2026-09-25' });
    const moved = { ...original, dueDate: '2026-09-27' };

    expect(itemsForDate(mergeCalendarItems([original], []), '2026-09-25')).toHaveLength(1);
    expect(itemsForDate(mergeCalendarItems([moved], []), '2026-09-25')).toHaveLength(0);
    expect(itemsForDate(mergeCalendarItems([moved], []), '2026-09-27')).toHaveLength(1);
  });

  it('marks a completed task item as completed so the UI can show it struck through', () => {
    const items = mergeCalendarItems([makeTask({ status: 'completed' })], []);
    expect(items[0].completed).toBe(true);
  });

  it('sorts items by date then by time, with untimed items first on a given day', () => {
    const items = mergeCalendarItems(
      [makeTask({ id: 't-late', dueDate: '2026-09-25', dueTime: '18:00' })],
      [
        makeEvent({ id: 'e-early', startDate: '2026-09-25', startTime: '08:00' }),
        makeEvent({ id: 'e-allday', startDate: '2026-09-25', startTime: null, allDay: true }),
      ],
    );
    expect(items.map((i) => i.id)).toEqual(['e-allday', 'e-early', 't-late']);
  });
});
