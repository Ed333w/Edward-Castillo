'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import * as taskService from '@/lib/services/tasks';
import * as eventService from '@/lib/services/events';
import * as categoryService from '@/lib/services/categories';
import * as profileService from '@/lib/services/profiles';
import type { CalendarEvent, Category, Profile, Task } from '@/types/domain';

/**
 * Single source of truth for the app's shared data. Loads everything once,
 * then keeps it fresh by refetching whenever Supabase Realtime reports a
 * change on the shared tables — this is what lets Edward's phone and Vale's
 * laptop see the same list within a second of each other (spec §22).
 */
export function usePlannerData() {
  const [supabase] = useState(() => createClient());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const [t, e, c, p] = await Promise.all([
        taskService.listTasks(supabase),
        eventService.listEvents(supabase),
        categoryService.listCategories(supabase),
        profileService.listProfiles(supabase),
      ]);
      setTasks(t);
      setEvents(e);
      setCategories(c);
      setProfiles(p);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    // Bootstrapping the initial fetch on mount — the standard data-fetching
    // effect pattern. `reload` sets state once the async request resolves,
    // not synchronously, so this doesn't cause the cascading-render issue
    // the rule normally guards against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();

    const channel = supabase
      .channel('planner-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => reload())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, () => reload())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => reload())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [reload, supabase]);

  return { supabase, tasks, events, categories, profiles, loading, error, reload };
}
