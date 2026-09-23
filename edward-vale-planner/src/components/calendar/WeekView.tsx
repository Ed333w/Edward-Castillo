import type { CalendarItem } from '@/types/domain';
import { isToday, toDateKey, weekDays } from '@/lib/utils/dates';
import { itemsForDate } from '@/lib/utils/merge';
import { CalendarItemPill } from './CalendarItemPill';
import { clsx } from '@/lib/utils/clsx';

const WEEKDAY_LABEL = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];

export function WeekView({
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
  const days = weekDays(anchor);

  return (
    <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-7 md:p-6">
      {days.map((day, i) => {
        const dateKey = toDateKey(day);
        const dayItems = itemsForDate(items, dateKey);
        return (
          <div key={dateKey} className="rounded-lg border border-(--border) bg-(--surface)">
            <button
              type="button"
              onClick={() => onDayClick(dateKey)}
              className={clsx(
                'flex w-full items-baseline justify-between rounded-t-lg px-2 py-1.5 text-left',
                isToday(dateKey) && 'bg-(--primary) text-(--primary-foreground)',
              )}
            >
              <span className="text-xs font-medium uppercase">{WEEKDAY_LABEL[i]}</span>
              <span className="text-sm font-semibold">{day.getDate()}</span>
            </button>
            <div className="space-y-1 p-1.5">
              {dayItems.length === 0 ? (
                <p className="px-1 py-2 text-center text-xs text-(--muted)">—</p>
              ) : (
                dayItems.map((item) => (
                  <CalendarItemPill key={`${item.kind}-${item.id}`} item={item} onClick={() => onItemClick(item)} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
