import type { CalendarItem } from '@/types/domain';
import { formatTime } from '@/lib/utils/dates';
import { clsx } from '@/lib/utils/clsx';

const PRIORITY_BORDER: Record<string, string> = {
  low: 'var(--priority-low)',
  medium: 'var(--priority-medium)',
  high: 'var(--priority-high)',
};

export function CalendarItemPill({ item, onClick }: { item: CalendarItem; onClick: () => void }) {
  const time = formatTime(item.time);
  const borderColor = item.priority ? PRIORITY_BORDER[item.priority] : 'var(--primary)';

  return (
    <button
      type="button"
      onClick={(e) => {
        // This pill can sit inside a clickable day/hour cell — stop the
        // click from also triggering that parent cell's "create new" action.
        e.stopPropagation();
        onClick();
      }}
      title={item.title}
      style={{ borderLeftColor: borderColor }}
      className={clsx(
        'block w-full truncate rounded border-l-2 bg-(--surface-hover) px-1.5 py-0.5 text-left text-xs text-(--foreground)',
        item.completed && 'line-through opacity-60',
      )}
    >
      {time && <span className="text-(--muted)">{time} </span>}
      {item.title}
    </button>
  );
}
