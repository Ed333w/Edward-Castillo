// Supabase Edge Function (Deno). Sends Web Push notifications for tasks and
// calendar events whose reminder time has just arrived, then records the
// dispatch so the same reminder is never sent twice.
//
// This function does nothing by itself — it must be scheduled. In the
// Supabase SQL editor, after deploying it, run (adjust the URL/keys):
//
//   select cron.schedule(
//     'send-reminders-every-minute',
//     '* * * * *',
//     $$
//     select net.http_post(
//       url := 'https://<project-ref>.functions.supabase.co/send-reminders',
//       headers := jsonb_build_object(
//         'Authorization', 'Bearer <SERVICE_ROLE_KEY>',
//         'Content-Type', 'application/json'
//       )
//     );
//     $$
//   );
//
// Limitation: only tasks/events that have BOTH a date and a time can get a
// precise push reminder here, because "N minutes before" needs an exact
// instant. All-day items are still visible in the dashboard/calendar but do
// not trigger a scheduled push.

import { createClient } from 'jsr:@supabase/supabase-js@2';
import webPush from 'npm:web-push@3';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:no-reply@example.com';

webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

interface Candidate {
  id: string;
  title: string;
  date: string;
  time: string;
  reminder_minutes: number;
}

Deno.serve(async (req) => {
  if (req.headers.get('Authorization') !== `Bearer ${SERVICE_ROLE_KEY}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const now = new Date();
  const results: Record<string, number> = { tasks: 0, events: 0, pushed: 0, failed: 0 };

  const { data: tasks, error: taskErr } = await supabase
    .from('tasks')
    .select('id, title, due_date, due_time, reminder_minutes')
    .not('due_date', 'is', null)
    .not('due_time', 'is', null)
    .not('reminder_minutes', 'is', null)
    .neq('status', 'completed');
  if (taskErr) throw taskErr;

  const { data: events, error: eventErr } = await supabase
    .from('calendar_events')
    .select('id, title, start_date, start_time, reminder_minutes')
    .not('start_time', 'is', null)
    .not('reminder_minutes', 'is', null);
  if (eventErr) throw eventErr;

  const dueTasks: Candidate[] = (tasks ?? [])
    .map((t) => ({ id: t.id, title: t.title, date: t.due_date!, time: t.due_time!, reminder_minutes: t.reminder_minutes! }))
    .filter((c) => isDue(c, now));

  const dueEvents: Candidate[] = (events ?? [])
    .map((e) => ({ id: e.id, title: e.title, date: e.start_date, time: e.start_time!, reminder_minutes: e.reminder_minutes! }))
    .filter((c) => isDue(c, now));

  const { data: subs, error: subErr } = await supabase.from('push_subscriptions').select('*');
  if (subErr) throw subErr;

  for (const candidate of dueTasks) {
    const sent = await dispatch(supabase, subs ?? [], 'task', candidate);
    results.tasks++;
    results.pushed += sent;
  }
  for (const candidate of dueEvents) {
    const sent = await dispatch(supabase, subs ?? [], 'event', candidate);
    results.events++;
    results.pushed += sent;
  }

  return Response.json(results);
});

function isDue(c: Candidate, now: Date): boolean {
  const target = new Date(`${c.date}T${c.time.slice(0, 5)}:00`);
  const fireAt = new Date(target.getTime() - c.reminder_minutes * 60_000);
  const diffMs = now.getTime() - fireAt.getTime();
  // Positive and within the last 2 minutes -> due for this run (the cron
  // fires every minute; the 2-minute window tolerates a slow invocation).
  return diffMs >= 0 && diffMs < 2 * 60_000;
}

// deno-lint-ignore no-explicit-any
async function dispatch(supabase: any, subs: any[], entityType: 'task' | 'event', c: Candidate): Promise<number> {
  const { error: dispatchError } = await supabase
    .from('reminder_dispatches')
    .insert({ entity_type: entityType, entity_id: c.id });
  if (dispatchError) return 0; // already dispatched (unique violation) or DB error — skip

  const payload = JSON.stringify({
    title: entityType === 'task' ? `Tarea: ${c.title}` : `Evento: ${c.title}`,
    body: `Hoy a las ${c.time.slice(0, 5)}`,
    tag: `${entityType}:${c.id}`,
  });

  let sent = 0;
  for (const sub of subs) {
    try {
      await webPush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
        payload,
      );
      sent++;
    } catch (err) {
      // Expired/invalid subscription -> remove it so we stop retrying it.
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
      }
    }
  }
  return sent;
}
