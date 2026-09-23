'use client';

import type { Category, Priority, Profile } from '@/types/domain';
import { PRIORITY_LABELS } from '@/types/domain';
import type { DateFilter, TaskFilters as TaskFiltersState } from '@/lib/utils/filterTasks';
import { clsx } from '@/lib/utils/clsx';

const DATE_CHIPS: Array<{ value: DateFilter; label: string }> = [
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Esta semana' },
  { value: 'month', label: 'Este mes' },
  { value: 'no_date', label: 'Sin fecha' },
  { value: 'all', label: 'Todas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'overdue', label: 'Atrasadas' },
];

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (filters: TaskFiltersState) => void;
  categories: Category[];
  profiles: Profile[];
}

export function TaskFiltersBar({ filters, onChange, categories, profiles }: TaskFiltersProps) {
  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="Filtrar por fecha" className="flex flex-wrap gap-2">
        {DATE_CHIPS.map((chip) => (
          <button
            key={chip.value}
            type="button"
            role="radio"
            aria-checked={filters.dateFilter === chip.value}
            onClick={() => onChange({ ...filters, dateFilter: chip.value })}
            className={clsx(
              'rounded-full border px-3 py-1 text-xs font-medium transition',
              filters.dateFilter === chip.value
                ? 'border-(--primary) bg-(--primary) text-(--primary-foreground)'
                : 'border-(--border) bg-(--surface) text-(--foreground) hover:bg-(--surface-hover)',
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          aria-label="Filtrar por persona"
          value={filters.personId}
          onChange={(e) => onChange({ ...filters, personId: e.target.value })}
          className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-xs text-(--foreground)"
        >
          <option value="all">Edward y Vale</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.displayName}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar por categoría"
          value={filters.categoryId}
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value })}
          className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-xs text-(--foreground)"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          aria-label="Filtrar por prioridad"
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as Priority | 'all' })}
          className="rounded-lg border border-(--border) bg-(--surface) px-2 py-1 text-xs text-(--foreground)"
        >
          <option value="all">Toda prioridad</option>
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
