import type { Category, Priority } from '@/types/domain';
import { PRIORITY_LABELS } from '@/types/domain';

const PRIORITY_VAR: Record<Priority, string> = {
  low: 'var(--priority-low)',
  medium: 'var(--priority-medium)',
  high: 'var(--priority-high)',
};

export function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span
      className="inline-block h-2 w-2 shrink-0 rounded-full"
      style={{ backgroundColor: PRIORITY_VAR[priority] }}
      title={`Prioridad ${PRIORITY_LABELS[priority].toLowerCase()}`}
      aria-label={`Prioridad ${PRIORITY_LABELS[priority].toLowerCase()}`}
    />
  );
}

export function CategoryChip({ category }: { category: Category | undefined }) {
  if (!category) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${category.color}20`, color: category.color }}
    >
      {category.name}
    </span>
  );
}

export function AttributionLine({
  createdByName,
  updatedByName,
  createdAt,
  updatedAt,
}: {
  createdByName: string;
  updatedByName?: string | null;
  createdAt: string;
  updatedAt?: string;
}) {
  const created = new Date(createdAt);
  // The audit trigger sets created_at = updated_at (same transaction, same
  // `now()`) on INSERT, and only advances updated_at on a later UPDATE — so
  // any difference means a real edit happened, regardless of how soon after.
  const showUpdated = updatedByName && updatedAt && updatedAt !== createdAt;

  return (
    <p className="text-xs text-(--muted)">
      Creado por {createdByName} ·{' '}
      {created.toLocaleDateString('es', { day: 'numeric', month: 'short' })}
      {showUpdated && updatedAt && (
        <>
          {' '}
          · Modificado por {updatedByName}{' '}
          {new Date(updatedAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
        </>
      )}
    </p>
  );
}
