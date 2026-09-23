'use client';

import type { Category, Profile, Task } from '@/types/domain';
import { formatShortDate, formatTime, isOverdue } from '@/lib/utils/dates';
import { resolveCategory, resolveProfileName } from '@/lib/utils/resolveProfile';
import { AttributionLine, CategoryChip, PriorityDot } from '@/components/common/Badges';
import { clsx } from '@/lib/utils/clsx';

interface TaskItemProps {
  task: Task;
  profiles: Profile[];
  categories: Category[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, profiles, categories, onToggle, onEdit, onDelete }: TaskItemProps) {
  const overdue = isOverdue(task.dueDate, task.dueTime, task.status);
  const category = resolveCategory(categories, task.categoryId);
  const time = formatTime(task.dueTime);

  return (
    <li
      className={clsx(
        'group flex items-start gap-3 rounded-lg border border-(--border) bg-(--surface) p-3',
        task.status === 'completed' && 'opacity-60',
      )}
    >
      <input
        type="checkbox"
        checked={task.status === 'completed'}
        onChange={() => onToggle(task)}
        aria-label={`Marcar "${task.title}" como completada`}
        className="mt-1 h-4 w-4 shrink-0 accent-(--primary)"
      />

      <button type="button" onClick={() => onEdit(task)} className="flex-1 text-left">
        <p className={clsx('text-sm font-medium text-(--foreground)', task.status === 'completed' && 'line-through')}>
          {task.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <PriorityDot priority={task.priority} />
          {task.dueDate && (
            <span className={clsx('text-xs', overdue ? 'font-medium text-(--danger)' : 'text-(--muted)')}>
              {overdue ? 'Atrasada · ' : ''}
              {formatShortDate(task.dueDate)}
              {time ? ` · ${time}` : ''}
            </span>
          )}
          <CategoryChip category={category} />
        </div>
        <div className="mt-1">
          <AttributionLine
            createdByName={resolveProfileName(profiles, task.createdBy)}
            updatedByName={resolveProfileName(profiles, task.updatedBy)}
            createdAt={task.createdAt}
            updatedAt={task.updatedAt}
          />
        </div>
      </button>

      <button
        type="button"
        onClick={() => onDelete(task)}
        aria-label={`Eliminar "${task.title}"`}
        className="rounded p-1 text-(--muted) opacity-0 transition hover:text-(--danger) focus-visible:opacity-100 group-hover:opacity-100"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
        </svg>
      </button>
    </li>
  );
}
