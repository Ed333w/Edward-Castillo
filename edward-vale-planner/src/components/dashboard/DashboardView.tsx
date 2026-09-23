'use client';

import { useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { CalendarEvent, Category, Profile, Task } from '@/types/domain';
import { useActiveProfile } from '@/components/providers/ProfileProvider';
import { mergeCalendarItems } from '@/lib/utils/merge';
import { formatFriendlyDate, formatShortDate, formatTime, todayLocalDate } from '@/lib/utils/dates';
import * as taskService from '@/lib/services/tasks';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import Link from 'next/link';

interface DashboardViewProps {
  supabase: SupabaseClient<Database>;
  tasks: Task[];
  events: CalendarEvent[];
  categories: Category[];
  profiles: Profile[];
  onChanged: () => void;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function DashboardView({ supabase, tasks, events, categories, profiles, onChanged }: DashboardViewProps) {
  const profile = useActiveProfile();
  const today = todayLocalDate();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const todaysTasks = useMemo(
    () => tasks.filter((t) => t.dueDate === today && t.status !== 'completed'),
    [tasks, today],
  );
  const todaysEvents = useMemo(() => events.filter((e) => e.startDate === today), [events, today]);

  const nextItem = useMemo(() => {
    const items = mergeCalendarItems(tasks, events).filter((i) => !i.completed && i.date >= today);
    return items[0] ?? null;
  }, [tasks, events, today]);

  const upcomingDays = useMemo(() => {
    const items = mergeCalendarItems(tasks, events).filter((i) => !i.completed && i.date > today);
    const byDate = new Map<string, typeof items>();
    for (const item of items) {
      const list = byDate.get(item.date) ?? [];
      list.push(item);
      byDate.set(item.date, list);
    }
    return [...byDate.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).slice(0, 4);
  }, [tasks, events, today]);

  async function handleToggle(task: Task) {
    await taskService.setTaskStatus(supabase, task.id, task.status === 'completed' ? 'pending' : 'completed');
    onChanged();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-xl font-semibold text-(--foreground)">
          {greeting()}, {profile.displayName}
        </h1>
        <p className="text-sm text-(--muted)">{formatFriendlyDate(today)}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-(--border) bg-(--surface) p-3">
          <p className="text-2xl font-semibold text-(--foreground)">{todaysTasks.length}</p>
          <p className="text-xs text-(--muted)">tareas pendientes hoy</p>
        </div>
        <div className="rounded-lg border border-(--border) bg-(--surface) p-3">
          <p className="text-2xl font-semibold text-(--foreground)">{todaysEvents.length}</p>
          <p className="text-xs text-(--muted)">eventos hoy</p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-(--muted)">Próximo</h2>
        {nextItem ? (
          <div className="rounded-lg border border-(--border) bg-(--surface) p-3">
            <p className="font-medium text-(--foreground)">{nextItem.title}</p>
            <p className="text-sm text-(--muted)">
              {formatShortDate(nextItem.date)}
              {nextItem.time ? ` · ${formatTime(nextItem.time)}` : ''}
            </p>
          </div>
        ) : (
          <EmptyState message="No hay próximos eventos ni tareas." />
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-(--muted)">Tareas de hoy</h2>
        {todaysTasks.length === 0 ? (
          <EmptyState message="No tienes tareas pendientes hoy 🎉" />
        ) : (
          <ul className="space-y-2">
            {todaysTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                profiles={profiles}
                categories={categories}
                onToggle={handleToggle}
                onEdit={setEditingTask}
                onDelete={setDeletingTask}
              />
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-(--muted)">Próximos días</h2>
        {upcomingDays.length === 0 ? (
          <EmptyState message="No hay nada agendado próximamente." />
        ) : (
          <ul className="space-y-3">
            {upcomingDays.map(([date, dayItems]) => (
              <li key={date}>
                <p className="text-xs font-medium text-(--muted)">{formatShortDate(date)}</p>
                <ul className="mt-1 space-y-1">
                  {dayItems.map((item) => (
                    <li key={`${item.kind}-${item.id}`} className="text-sm text-(--foreground)">
                      {item.time ? `${formatTime(item.time)} · ` : ''}
                      {item.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <Link href="/calendar" className="mt-2 inline-block text-sm text-(--primary) hover:underline">
          Ver calendario completo →
        </Link>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-(--muted)">Notificaciones</h2>
        <NotificationSettings supabase={supabase} profileId={profile.id} />
      </section>

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
