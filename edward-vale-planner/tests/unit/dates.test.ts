import { describe, expect, it } from 'vitest';
import { isOverdue, isToday, todayLocalDate } from '@/lib/utils/dates';

describe('isOverdue', () => {
  it('is false for a completed task even if the date is in the past', () => {
    expect(isOverdue('2000-01-01', '09:00', 'completed')).toBe(false);
  });

  it('is false when there is no due date', () => {
    expect(isOverdue(null, null, 'pending')).toBe(false);
  });

  it('is true for a pending task whose date+time already passed', () => {
    expect(isOverdue('2000-01-01', '09:00', 'pending')).toBe(true);
  });

  it('is false for a pending task due later today with only a date (defaults to end of day)', () => {
    expect(isOverdue(todayLocalDate(), null, 'pending')).toBe(false);
  });

  it('is true for a task due tomorrow (not overdue yet)', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const iso = tomorrow.toISOString().slice(0, 10);
    expect(isOverdue(iso, null, 'pending')).toBe(false);
  });
});

describe('isToday', () => {
  it('matches the local today date key', () => {
    expect(isToday(todayLocalDate())).toBe(true);
  });

  it('does not match a past date', () => {
    expect(isToday('2000-01-01')).toBe(false);
  });
});
