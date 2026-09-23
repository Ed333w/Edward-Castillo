import type { CalendarItem } from '@/types/domain';
import { isCurrentMonth, isToday, monthGrid, toDateKey } from '@/lib/utils/dates';
import { itemsForDate } from '@/lib/utils/merge';
import { CalendarItemPill } from './CalendarItemPill';
import { clsx } from '@/lib/utils/clsx';

const WEEKDAY_LABEL = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MAX_VISIBLE = 3;

export function MonthView({
  anchor,
  items,
  onItemClick,
  onDayClick,
}: {
  anchor: Date;
  items: CalendarItem[];
  onItemClick: (item: CalendarItem) => void;
  onDayClick: (dateKey: string) => void;
}) {
  const days = monthGrid(anchor);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-t-lg border border-b-0 border-(--border) bg-(--border) text-center text-xs font-medium text-(--muted)">
        {WEEKDAY_LABEL.map((d) => (
          <div key={d} className="bg-(--surface) py-1.5">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b-lg border border-(--border) bg-(--border)">
        {days.map((day) => {
          const dateKey = toDateKey(day);
          const dayItems = itemsForDate(items, dateKey);
          const visible = dayItems.slice(0, MAX_VISIBLE);
          const overflow = dayItems.length - visible.length;

          return (
            <div
              key={dateKey}
              className={clsx(
                'min-h-[6rem] bg-(--surface) p-1',
                !isCurrentMonth(day, anchor) && 'bg-(--background) opacity-50',
              )}
            >
              <button
                type="button"
                onClick={() => onDayClick(dateKey)}
                className={clsx(
                  'mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                  isToday(dateKey) ? 'bg-(--primary) text-(--primary-foreground)' : 'text-(--foreground)',
                )}
              >
                {day.getDate()}
              </button>
              <div className="space-y-1">
                {visible.map((item) => (
                  <CalendarItemPill key={`${item.kind}-${item.id}`} item={item} onClick={() => onItemClick(item)} />
                ))}
                {overflow > 0 && (
                  <button
                    type="button"
                    onClick={() => onDayClick(dateKey)}
                    className="px-1 text-xs text-(--muted) hover:text-(--foreground)"
                  >
                    +{overflow} más
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
