'use client';

import { usePlannerData } from '@/hooks/usePlannerData';
import { CalendarView } from '@/components/calendar/CalendarView';

export default function CalendarPage() {
  const { supabase, tasks, events, categories, loading, error, reload } = usePlannerData();

  if (loading) return <p className="p-6 text-sm text-(--muted)">Cargando…</p>;
  if (error) return <p className="p-6 text-sm text-(--danger)">{error}</p>;

  return (
    <CalendarView supabase={supabase} tasks={tasks} events={events} categories={categories} onChanged={reload} />
  );
}
