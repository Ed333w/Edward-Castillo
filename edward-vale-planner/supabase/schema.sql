-- Edward & Vale Planner — database schema
-- Run this once against a fresh Supabase project (SQL editor or `supabase db push`).
-- Design notes:
--   * Only two people may ever use this app. Authorization is enforced at the
--     database layer (allowed_emails + a trigger on auth.users), never trusted
--     from the client.
--   * created_by / updated_by are NEVER accepted from client input — they are
--     forced server-side from auth.uid() via BEFORE triggers, so no request can
--     forge authorship.
--   * Every table has Row Level Security enabled. Access requires a matching
--     row in `profiles`, i.e. an authenticated, allow-listed user.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. Allow-list: the only two email addresses permitted to hold an account.
--    Populate this via supabase/seed.sql with the real Edward/Vale emails
--    before anyone signs in. No RLS grants are given on this table — it is
--    only readable by the trigger below (SECURITY DEFINER).
-- ---------------------------------------------------------------------------
create table if not exists public.allowed_emails (
  email        text primary key,
  display_name text not null check (display_name in ('Edward', 'Vale'))
);

revoke all on public.allowed_emails from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Profiles — one row per authorized person, id = auth.users.id.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (display_name in ('Edward', 'Vale')),
  email        text not null unique,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by any authorized profile"
  on public.profiles for select
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));

-- Creates a profile automatically the first time an allow-listed email signs
-- in. Rejects (aborts the auth signup) any email that is not on the list —
-- this is the real access-control boundary, independent of the UI.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_display_name text;
begin
  select display_name into v_display_name
  from public.allowed_emails
  where email = new.email;

  if v_display_name is null then
    raise exception 'Email % is not authorized for this application', new.email;
  end if;

  insert into public.profiles (id, display_name, email)
  values (new.id, v_display_name, new.email);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 3. Categories (shared between both profiles)
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 60),
  color      text not null default '#64748b' check (color ~ '^#[0-9a-fA-F]{6}$'),
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "shared read categories" on public.categories for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));
create policy "shared insert categories" on public.categories for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid()));
create policy "shared delete categories" on public.categories for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));

create or replace function public.set_created_by()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.created_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists categories_created_by on public.categories;
create trigger categories_created_by before insert on public.categories
  for each row execute function public.set_created_by();

insert into public.categories (name, color, created_by)
select * from (values
  ('Universidad', '#3b82f6', null::uuid),
  ('Trabajo',     '#8b5cf6', null::uuid),
  ('Personal',    '#10b981', null::uuid),
  ('Finanzas',    '#f59e0b', null::uuid),
  ('Otro',        '#64748b', null::uuid)
) as seed(name, color, created_by)
where not exists (select 1 from public.categories);

-- ---------------------------------------------------------------------------
-- 4. Shared audit trigger: forces created_by/updated_by/timestamps from the
--    server session. Reused by tasks and calendar_events.
-- ---------------------------------------------------------------------------
create or replace function public.set_audit_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := auth.uid();
    new.updated_by := auth.uid();
    new.created_at := now();
    new.updated_at := now();
  elsif tg_op = 'UPDATE' then
    new.created_by := old.created_by;
    new.created_at := old.created_at;
    new.updated_by := auth.uid();
    new.updated_at := now();
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Tasks
-- ---------------------------------------------------------------------------
create table if not exists public.tasks (
  id               uuid primary key default gen_random_uuid(),
  title            text not null check (char_length(title) between 1 and 200),
  description      text check (char_length(description) <= 2000),
  due_date         date,
  due_time         time,
  priority         text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  category_id      uuid references public.categories (id) on delete set null,
  status           text not null default 'pending' check (status in ('pending', 'in_progress', 'completed')),
  reminder_minutes integer check (reminder_minutes is null or reminder_minutes >= 0),
  created_by       uuid not null references public.profiles (id),
  updated_by       uuid references public.profiles (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "shared read tasks" on public.tasks for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));
create policy "shared insert tasks" on public.tasks for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid()));
create policy "shared update tasks" on public.tasks for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));
create policy "shared delete tasks" on public.tasks for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));

drop trigger if exists tasks_audit on public.tasks;
create trigger tasks_audit before insert or update on public.tasks
  for each row execute function public.set_audit_fields();

create index if not exists tasks_due_date_idx on public.tasks (due_date);
create index if not exists tasks_status_idx on public.tasks (status);

-- ---------------------------------------------------------------------------
-- 6. Calendar events
-- ---------------------------------------------------------------------------
create table if not exists public.calendar_events (
  id               uuid primary key default gen_random_uuid(),
  title            text not null check (char_length(title) between 1 and 200),
  description      text check (char_length(description) <= 2000),
  start_date       date not null,
  start_time       time,
  end_date         date,
  end_time         time,
  all_day          boolean not null default false,
  category_id      uuid references public.categories (id) on delete set null,
  reminder_minutes integer check (reminder_minutes is null or reminder_minutes >= 0),
  created_by       uuid not null references public.profiles (id),
  updated_by       uuid references public.profiles (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint calendar_events_end_after_start check (
    end_date is null or end_date >= start_date
  )
);

alter table public.calendar_events enable row level security;

create policy "shared read events" on public.calendar_events for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));
create policy "shared insert events" on public.calendar_events for insert to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid()));
create policy "shared update events" on public.calendar_events for update to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));
create policy "shared delete events" on public.calendar_events for delete to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));

drop trigger if exists events_audit on public.calendar_events;
create trigger events_audit before insert or update on public.calendar_events
  for each row execute function public.set_audit_fields();

create index if not exists events_start_date_idx on public.calendar_events (start_date);

-- ---------------------------------------------------------------------------
-- 7. Activity log — lightweight audit trail (who created / modified what).
-- ---------------------------------------------------------------------------
create table if not exists public.activity_log (
  id          uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('task', 'event')),
  entity_id   uuid not null,
  action      text not null check (action in ('created', 'updated', 'completed', 'deleted')),
  actor       uuid not null references public.profiles (id),
  occurred_at timestamptz not null default now(),
  summary     text
);

alter table public.activity_log enable row level security;

create policy "shared read activity" on public.activity_log for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid()));
-- No insert/update/delete policies for clients: only SECURITY DEFINER
-- triggers below may write to this table.

create index if not exists activity_log_entity_idx on public.activity_log (entity_type, entity_id);

create or replace function public.log_task_activity()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activity_log (entity_type, entity_id, action, actor, summary)
    values ('task', new.id, 'created', auth.uid(), new.title);
  elsif tg_op = 'UPDATE' then
    insert into public.activity_log (entity_type, entity_id, action, actor, summary)
    values (
      'task', new.id,
      case when new.status = 'completed' and old.status <> 'completed' then 'completed' else 'updated' end,
      auth.uid(), new.title
    );
  elsif tg_op = 'DELETE' then
    insert into public.activity_log (entity_type, entity_id, action, actor, summary)
    values ('task', old.id, 'deleted', auth.uid(), old.title);
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists tasks_log on public.tasks;
create trigger tasks_log after insert or update or delete on public.tasks
  for each row execute function public.log_task_activity();

create or replace function public.log_event_activity()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into public.activity_log (entity_type, entity_id, action, actor, summary)
    values ('event', new.id, 'created', auth.uid(), new.title);
  elsif tg_op = 'UPDATE' then
    insert into public.activity_log (entity_type, entity_id, action, actor, summary)
    values ('event', new.id, 'updated', auth.uid(), new.title);
  elsif tg_op = 'DELETE' then
    insert into public.activity_log (entity_type, entity_id, action, actor, summary)
    values ('event', old.id, 'deleted', auth.uid(), old.title);
  end if;
  return coalesce(new, old);
end;
$$;

drop trigger if exists events_log on public.calendar_events;
create trigger events_log after insert or update or delete on public.calendar_events
  for each row execute function public.log_event_activity();

-- ---------------------------------------------------------------------------
-- 8. Web Push subscriptions — private per device/profile.
-- ---------------------------------------------------------------------------
create table if not exists public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth_key   text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

create policy "read own push subscriptions" on public.push_subscriptions for select to authenticated
  using (profile_id = auth.uid());
create policy "insert own push subscriptions" on public.push_subscriptions for insert to authenticated
  with check (profile_id = auth.uid());
create policy "delete own push subscriptions" on public.push_subscriptions for delete to authenticated
  using (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 9. Reminder dispatch ledger — used by the send-reminders Edge Function to
--    avoid sending the same push notification twice. Only the service role
--    (Edge Function) touches this table; RLS blocks clients entirely.
-- ---------------------------------------------------------------------------
create table if not exists public.reminder_dispatches (
  entity_type  text not null check (entity_type in ('task', 'event')),
  entity_id    uuid not null,
  dispatched_at timestamptz not null default now(),
  primary key (entity_type, entity_id)
);

alter table public.reminder_dispatches enable row level security;
-- No policies granted to anon/authenticated -> clients have zero access.
-- The Edge Function uses the service_role key, which bypasses RLS.

-- Clear a stale dispatch record whenever the due date/time/reminder changes,
-- so editing a task or event reschedules its reminder instead of silently
-- keeping the old (already-sent) one suppressed.
create or replace function public.reset_task_reminder_dispatch()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.due_date is distinct from old.due_date
     or new.due_time is distinct from old.due_time
     or new.reminder_minutes is distinct from old.reminder_minutes then
    delete from public.reminder_dispatches where entity_type = 'task' and entity_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists tasks_reset_reminder on public.tasks;
create trigger tasks_reset_reminder after update on public.tasks
  for each row execute function public.reset_task_reminder_dispatch();

create or replace function public.reset_event_reminder_dispatch()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.start_date is distinct from old.start_date
     or new.start_time is distinct from old.start_time
     or new.reminder_minutes is distinct from old.reminder_minutes then
    delete from public.reminder_dispatches where entity_type = 'event' and entity_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists events_reset_reminder on public.calendar_events;
create trigger events_reset_reminder after update on public.calendar_events
  for each row execute function public.reset_event_reminder_dispatch();

-- ---------------------------------------------------------------------------
-- 10. Realtime — lets both devices see changes live (RLS still applies to
--     every change broadcast, so only authorized profiles receive them).
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.calendar_events;
alter publication supabase_realtime add table public.categories;
