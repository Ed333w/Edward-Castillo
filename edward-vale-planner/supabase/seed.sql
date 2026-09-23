-- Run this AFTER schema.sql, once, against your Supabase project.
-- Replace the two placeholder emails with the real addresses for Edward and
-- Vale. These are the only two emails ever allowed to create an account —
-- anyone else who requests a magic link will have their sign-up rejected by
-- the on_auth_user_created trigger in schema.sql.

insert into public.allowed_emails (email, display_name) values
  ('edward@example.com', 'Edward'),
  ('vale@example.com', 'Vale')
on conflict (email) do update set display_name = excluded.display_name;
