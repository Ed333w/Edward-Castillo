import { describe, expect, it } from 'vitest';
import { DEFAULT_FILTERS, filterTasks } from '@/lib/utils/filterTasks';
import { todayLocalDate } from '@/lib/utils/dates';
import type { Task } from '@/types/domain';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: overrides.id ?? 'task-1',
    title: 'Tarea',
    description: null,
    dueDate: null,
    dueTime: null,
    priority: 'medium',
    categoryId: null,
    status: 'pending',
    reminderMinutes: null,
    createdBy: 'edward-id',
    updatedBy: null,
    createdAt: '2026-09-20T00:00:00Z',
    updatedAt: '2026-09-20T00:00:00Z',
    ...overrides,
  };
}

describe('filterTasks', () => {
  it('"Todas" excludes completed tasks by default', () => {
    const tasks = [makeTask({ id: 'a', status: 'pending' }), makeTask({ id: 'b', status: 'completed' })];
    const result = filterTasks(tasks, DEFAULT_FILTERS);
    expect(result.map((t) => t.id)).toEqual(['a']);
  });

  it('"Completadas" shows only completed tasks', () => {
    const tasks = [makeTask({ id: 'a', status: 'pending' }), makeTask({ id: 'b', status: 'completed' })];
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, dateFilter: 'completed' });
    expect(result.map((t) => t.id)).toEqual(['b']);
  });

  it('"Sin fecha" shows only tasks without a due date', () => {
    const tasks = [
      makeTask({ id: 'no-date', dueDate: null }),
      makeTask({ id: 'with-date', dueDate: todayLocalDate() }),
    ];
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, dateFilter: 'no_date' });
    expect(result.map((t) => t.id)).toEqual(['no-date']);
  });

  it('"Hoy" shows only tasks due today', () => {
    const tasks = [
      makeTask({ id: 'today', dueDate: todayLocalDate() }),
      makeTask({ id: 'future', dueDate: '2099-01-01' }),
    ];
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, dateFilter: 'today' });
    expect(result.map((t) => t.id)).toEqual(['today']);
  });

  it('"Atrasadas" shows only overdue pending tasks', () => {
    const tasks = [
      makeTask({ id: 'overdue', dueDate: '2000-01-01', dueTime: '09:00' }),
      makeTask({ id: 'future', dueDate: '2099-01-01' }),
      makeTask({ id: 'completed-overdue', dueDate: '2000-01-01', status: 'completed' }),
    ];
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, dateFilter: 'overdue' });
    expect(result.map((t) => t.id)).toEqual(['overdue']);
  });

  it('filters by person (createdBy)', () => {
    const tasks = [
      makeTask({ id: 'edward-task', createdBy: 'edward-id' }),
      makeTask({ id: 'vale-task', createdBy: 'vale-id' }),
    ];
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, personId: 'vale-id' });
    expect(result.map((t) => t.id)).toEqual(['vale-task']);
  });

  it('filters by priority', () => {
    const tasks = [makeTask({ id: 'low', priority: 'low' }), makeTask({ id: 'high', priority: 'high' })];
    const result = filterTasks(tasks, { ...DEFAULT_FILTERS, priority: 'high' });
    expect(result.map((t) => t.id)).toEqual(['high']);
  });
});
