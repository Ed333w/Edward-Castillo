'use client';

import { useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import type { Category, Profile, Task } from '@/types/domain';
import * as taskService from '@/lib/services/tasks';
import { DEFAULT_FILTERS, filterTasks, type TaskFilters } from '@/lib/utils/filterTasks';
import { QuickAddTask } from './QuickAddTask';
import { TaskFiltersBar } from './TaskFilters';
import { TaskItem } from './TaskItem';
import { TaskFormDialog } from './TaskFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';

interface TaskListProps {
  supabase: SupabaseClient<Database>;
  tasks: Task[];
  categories: Category[];
  profiles: Profile[];
  onChanged: () => void;
}

export function TaskList({ supabase, tasks, categories, profiles, onChanged }: TaskListProps) {
  const [filters, setFilters] = useState<TaskFilters>(DEFAULT_FILTERS);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);

  const visible = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);

  async function handleAdd(title: string) {
    await taskService.createTask(supabase, { title });
    onChanged();
  }

  async function handleToggle(task: Task) {
    await taskService.setTaskStatus(supabase, task.id, task.status === 'completed' ? 'pending' : 'completed');
    onChanged();
  }

  async function handleSave(patch: Parameters<typeof taskService.updateTask>[2]) {
    if (!editing) return;
    await taskService.updateTask(supabase, editing.id, patch);
    onChanged();
  }

  async function handleDeleteConfirmed() {
    if (!deleting) return;
    await taskService.deleteTask(supabase, deleting.id);
    setDeleting(null);
    onChanged();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 md:p-6">
      <h1 className="text-xl font-semibold text-(--foreground)">Tareas</h1>

      <QuickAddTask onAdd={handleAdd} />

      <TaskFiltersBar filters={filters} onChange={setFilters} categories={categories} profiles={profiles} />

      {visible.length === 0 ? (
        <EmptyState message="No tienes tareas pendientes 🎉" />
      ) : (
        <ul className="space-y-2">
          {visible.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              profiles={profiles}
              categories={categories}
              onToggle={handleToggle}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          ))}
        </ul>
      )}

      <TaskFormDialog
        open={editing !== null}
        task={editing}
        categories={categories}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        onDelete={() => {
          setDeleting(editing);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="¿Eliminar esta tarea?"
        description={deleting?.title}
        confirmLabel="Eliminar"
        danger
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
