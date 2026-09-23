'use client';

import { usePlannerData } from '@/hooks/usePlannerData';
import { TaskList } from '@/components/tasks/TaskList';

export default function TasksPage() {
  const { supabase, tasks, categories, profiles, loading, error, reload } = usePlannerData();

  if (loading) return <p className="p-6 text-sm text-(--muted)">Cargando…</p>;
  if (error) return <p className="p-6 text-sm text-(--danger)">{error}</p>;

  return (
    <TaskList supabase={supabase} tasks={tasks} categories={categories} profiles={profiles} onChanged={reload} />
  );
}
