'use client';

import { useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { CalendarEvent, CalendarItem, Category, Task } from '@/types/domain';
import * as eventService from '@/lib/services/events';
import * as taskService from '@/lib/services/tasks';
import { mergeCalendarItems } from '@/lib/utils/merge';
import { formatFriendlyDate, shiftDay, shiftMonth, shiftWeek, toDateKey, todayLocalDate } from '@/lib/utils/dates';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { EventFormDialog } from './EventFormDialog';
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { clsx } from '@/lib/utils/clsx';

type ViewMode = 'day' | 'week' | 'month';

interface CalendarViewProps {
  supabase: SupabaseClient<Database>;
  tasks: Task[];
  events: CalendarEvent[];
  categories: Category[];
  onChanged: () => void;
}

export function CalendarView({ supabase, tasks, events, categories, onChanged }: CalendarViewProps) {
  const [mode, setMode] = useState<ViewMode>('month');
  const [anchor, setAnchor] = useState(() => new Date());

  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creatingDate, setCreatingDate] = useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const items = useMemo(() => mergeCalendarItems(tasks, events), [tasks, events]);

  function handleItemClick(item: CalendarItem) {
    if (item.kind === 'task') {
      const task = tasks.find((t) => t.id === item.id);
      if (task) setEditingTask(task);
    } else {
      const ev = events.find((e) => e.id === item.id);
      if (ev) setEditingEvent(ev);
    }
  }

  function goToday() {
    setAnchor(new Date());
  }

  function goPrev() {
    setAnchor((a) => (mode === 'day' ? shiftDay(a, -1) : mode === 'week' ? shiftWeek(a, -1) : shiftMonth(a, -1)));
  }

  function goNext() {
    setAnchor((a) => (mode === 'day' ? shiftDay(a, 1) : mode === 'week' ? shiftWeek(a, 1) : shiftMonth(a, 1)));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--border) p-4 md:p-6">
        <div>
          <h1 className="text-xl font-semibold text-(--foreground)">Calendario</h1>
          <p className="text-sm text-(--muted)">{formatFriendlyDate(toDateKey(anchor))}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-lg border border-(--border)">
            {(['day', 'week', 'month'] as ViewMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={clsx(
                  'px-3 py-1.5 text-sm font-medium',
                  mode === m ? 'bg-(--primary) text-(--primary-foreground)' : 'bg-(--surface) hover:bg-(--surface-hover)',
                )}
              >
                {m === 'day' ? 'Día' : m === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Anterior"
              className="rounded-lg border border-(--border) px-2 py-1.5 text-sm hover:bg-(--surface-hover)"
            >
              ←
            </button>
            <button
              type="button"
              onClick={goToday}
              className="rounded-lg border border-(--border) px-3 py-1.5 text-sm hover:bg-(--surface-hover)"
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Siguiente"
              className="rounded-lg border border-(--border) px-2 py-1.5 text-sm hover:bg-(--surface-hover)"
            >
              →
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCreatingDate(todayLocalDate())}
            className="rounded-lg bg-(--primary) px-3 py-1.5 text-sm font-medium text-(--primary-foreground)"
          >
            + Evento
          </button>
        </div>
      </div>

      {mode === 'day' && (
        <DayView
          anchor={anchor}
          items={items}
          onItemClick={handleItemClick}
          onSlotClick={(dateKey) => setCreatingDate(dateKey)}
        />
      )}
      {mode === 'week' && (
        <WeekView
          anchor={anchor}
          items={items}
          onItemClick={handleItemClick}
          onDayClick={(dateKey) => {
            setAnchor(new Date(`${dateKey}T00:00:00`));
            setMode('day');
          }}
        />
      )}
      {mode === 'month' && (
        <MonthView
          anchor={anchor}
          items={items}
          onItemClick={handleItemClick}
          onDayClick={(dateKey) => {
            setAnchor(new Date(`${dateKey}T00:00:00`));
            setMode('day');
          }}
        />
      )}

      <EventFormDialog
        open={editingEvent !== null || creatingDate !== null}
        event={editingEvent}
        defaultDate={creatingDate ?? undefined}
        categories={categories}
        onClose={() => {
          setEditingEvent(null);
          setCreatingDate(null);
        }}
        onSave={async (patch) => {
          if (editingEvent) {
            await eventService.updateEvent(supabase, editingEvent.id, patch);
          } else {
            await eventService.createEvent(supabase, patch);
          }
          onChanged();
        }}
        onDelete={
          editingEvent
            ? () => {
                setDeletingEvent(editingEvent);
                setEditingEvent(null);
              }
            : undefined
        }
      />

      <TaskFormDialog
        open={editingTask !== null}
        task={editingTask}
        categories={categories}
        onClose={() => setEditingTask(null)}
        onSave={async (patch) => {
          if (!editingTask) return;
          await taskService.updateTask(supabase, editingTask.id, patch);
          onChanged();
        }}
        onDelete={() => {
          setDeletingTask(editingTask);
          setEditingTask(null);
        }}
      />

      <ConfirmDialog
        open={deletingEvent !== null}
        title="¿Eliminar este evento?"
        description={deletingEvent?.title}
        confirmLabel="Eliminar"
        danger
        onConfirm={async () => {
          if (!deletingEvent) return;
          await eventService.deleteEvent(supabase, deletingEvent.id);
          setDeletingEvent(null);
          onChanged();
        }}
        onCancel={() => setDeletingEvent(null)}
      />

      <ConfirmDialog
        open={deletingTask !== null}
        title="¿Eliminar esta tarea?"
        description={deletingTask?.title}
        confirmLabel="Eliminar"
        danger
        onConfirm={async () => {
          if (!deletingTask) return;
          await taskService.deleteTask(supabase, deletingTask.id);
          setDeletingTask(null);
          onChanged();
        }}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}
