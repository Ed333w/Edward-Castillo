import type { Priority, Task } from '@/types/domain';
import { isOverdue, parseLocalDate, todayLocalDate } from './dates';
import { endOfWeek, endOfMonth, startOfWeek, startOfMonth, isWithinInterval } from 'date-fns';

export type DateFilter = 'today' | 'week' | 'month' | 'no_date' | 'all' | 'completed' | 'overdue';

export interface TaskFilters {
  dateFilter: DateFilter;
  personId: string | 'all';
  categoryId: string | 'all';
  priority: Priority | 'all';
}

export const DEFAULT_FILTERS: TaskFilters = {
  dateFilter: 'all',
  personId: 'all',
  categoryId: 'all',
  priority: 'all',
};

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const today = new Date();
  const todayStr = todayLocalDate();

  return tasks.filter((task) => {
    if (filters.dateFilter === 'completed' && task.status !== 'completed') return false;
    if (filters.dateFilter === 'overdue' && !isOverdue(task.dueDate, task.dueTime, task.status)) return false;
    if (filters.dateFilter === 'no_date' && task.dueDate !== null) return false;

    if (filters.dateFilter === 'today' && task.dueDate !== todayStr) return false;

    if (filters.dateFilter === 'week') {
      if (!task.dueDate) return false;
      const range = { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) };
      if (!isWithinInterval(parseLocalDate(task.dueDate), range)) return false;
    }

    if (filters.dateFilter === 'month') {
      if (!task.dueDate) return false;
      const range = { start: startOfMonth(today), end: endOfMonth(today) };
      if (!isWithinInterval(parseLocalDate(task.dueDate), range)) return false;
    }

    if (filters.personId !== 'all' && task.createdBy !== filters.personId) return false;
    if (filters.categoryId !== 'all' && task.categoryId !== filters.categoryId) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;

    // "Todas" and other date filters exclude completed tasks by default so
    // finished work doesn't clutter the working list, unless "Completadas"
    // was explicitly chosen.
    if (filters.dateFilter !== 'completed' && task.status === 'completed') return false;

    return true;
  });
}
