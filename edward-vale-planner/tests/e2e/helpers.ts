import { createClient } from '@supabase/supabase-js';
import type { Page } from '@playwright/test';

/**
 * Env vars required to run the backend-dependent specs against a real (ideally
 * a disposable/staging) Supabase project with two pre-authorized test
 * accounts already seeded in allowed_emails + profiles:
 *   E2E_SUPABASE_URL, E2E_SUPABASE_ANON_KEY, E2E_SUPABASE_SERVICE_ROLE_KEY,
 *   E2E_EDWARD_EMAIL, E2E_VALE_EMAIL
 * See tests/e2e/README.md.
 */
export function hasE2eBackend(): boolean {
  return Boolean(
    process.env.E2E_SUPABASE_URL &&
      process.env.E2E_SUPABASE_SERVICE_ROLE_KEY &&
      process.env.E2E_EDWARD_EMAIL &&
      process.env.E2E_VALE_EMAIL,
  );
}

/**
 * Signs a Playwright page in as the given test account WITHOUT clicking a
 * real emailed magic link: uses the Supabase admin API (service role) to
 * generate the same kind of link Supabase would have emailed, then navigates
 * to it so the app's real /auth/callback route handles it exactly as it
 * would in production.
 */
export async function signInAs(page: Page, email: string) {
  const admin = createClient(process.env.E2E_SUPABASE_URL!, process.env.E2E_SUPABASE_SERVICE_ROLE_KEY!);

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  if (error || !data.properties?.action_link) {
    throw new Error(`No se pudo generar el enlace de prueba para ${email}: ${error?.message}`);
  }

  await page.goto(data.properties.action_link);
  await page.waitForURL('**/dashboard');
}
