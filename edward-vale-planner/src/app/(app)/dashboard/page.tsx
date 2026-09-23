'use client';

import { usePlannerData } from '@/hooks/usePlannerData';
import { DashboardView } from '@/components/dashboard/DashboardView';

export default function DashboardPage() {
  const { supabase, tasks, events, categories, profiles, loading, error, reload } = usePlannerData();

  if (loading) return <p className="p-6 text-sm text-(--muted)">Cargando…</p>;
  if (error) return <p className="p-6 text-sm text-(--danger)">{error}</p>;

  return (
    <DashboardView
      supabase={supabase}
      tasks={tasks}
      events={events}
      categories={categories}
      profiles={profiles}
      onChanged={reload}
    />
  );
}
