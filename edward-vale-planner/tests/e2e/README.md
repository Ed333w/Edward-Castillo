# End-to-end tests

`profile-picker.spec.ts` needs nothing — it only exercises client-side UI
state and always runs with `npm run test:e2e`.

`task-attribution.spec.ts` and `task-calendar-sync.spec.ts` exercise real
data and real auth, so they need a Supabase project (ideally a disposable
staging project, **not** production) with the schema applied and two test
accounts already in `allowed_emails`. Set these env vars before running:

```
E2E_SUPABASE_URL=https://your-test-project.supabase.co
E2E_SUPABASE_ANON_KEY=...
E2E_SUPABASE_SERVICE_ROLE_KEY=...   # server-side only, never commit this
E2E_EDWARD_EMAIL=edward-test@example.com
E2E_VALE_EMAIL=vale-test@example.com
```

Without them, those two specs are skipped (not failed) so `npm run test:e2e`
still passes in a fresh checkout.

Sign-in in these tests does not click a real emailed link — it uses the
Supabase admin API (`auth.admin.generateLink`) to generate the same kind of
link Supabase would have emailed, then has Playwright navigate to it. That
still exercises the app's real `/auth/callback` route exactly as production
would.
