import type { CalendarItem } from '@/types/domain';
import { toDateKey } from '@/lib/utils/dates';
import { CalendarItemPill } from './CalendarItemPill';
import { EmptyState } from '@/components/common/EmptyState';

const HOURS = Array.from({ length: 24 }, (_, h) => h);

export function DayView({
  anchor,
  items,
  onItemClick,
  onSlotClick,
}: {
  anchor: Date;
  items: CalendarItem[];
  onItemClick: (item: CalendarItem) => void;
  onSlotClick: (dateKey: string, hour: number) => void;
}) {
  const dateKey = toDateKey(anchor);
  const dayItems = items.filter((i) => i.date === dateKey);
  const allDayItems = dayItems.filter((i) => i.allDay);
  const timedItems = dayItems.filter((i) => !i.allDay);

  return (
    <div className="p-4 md:p-6">
      {allDayItems.length > 0 && (
        <div className="mb-4 space-y-1">
          <p className="text-xs font-medium text-(--muted)">Todo el día</p>
          {allDayItems.map((item) => (
            <CalendarItemPill key={`${item.kind}-${item.id}`} item={item} onClick={() => onItemClick(item)} />
          ))}
        </div>
      )}

      {dayItems.length === 0 && <EmptyState message="No hay eventos para este día." />}

      <div className="divide-y divide-(--border) rounded-lg border border-(--border)">
        {HOURS.map((hour) => {
          const hourItems = timedItems.filter((i) => i.time && Number(i.time.slice(0, 2)) === hour);
          return (
            <div
              key={hour}
              role="button"
              tabIndex={0}
              onClick={() => onSlotClick(dateKey, hour)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSlotClick(dateKey, hour);
              }}
              className="flex w-full gap-3 p-2 text-left hover:bg-(--surface-hover)"
            >
              <span className="w-14 shrink-0 pt-0.5 text-xs text-(--muted)">
                {String(hour).padStart(2, '0')}:00
              </span>
              <div className="flex-1 space-y-1">
                {hourItems.map((item) => (
                  <CalendarItemPill
                    key={`${item.kind}-${item.id}`}
                    item={item}
                    onClick={() => onItemClick(item)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
