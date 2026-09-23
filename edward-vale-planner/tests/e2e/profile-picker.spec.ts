import { test, expect } from '@playwright/test';

// These checks only exercise client-side UI state (spec §1/§2) — no Supabase
// project is required, so they always run.

test('shows the Edward / Vale picker first', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Edward' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Vale' })).toBeVisible();
});

test('picking a name moves to the email step and can go back', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Vale' }).click();

  await expect(page.getByText('Continuar como Vale')).toBeVisible();
  await expect(page.getByLabel('Correo electrónico')).toBeVisible();

  await page.getByRole('button', { name: '← Cambiar perfil' }).click();
  await expect(page.getByRole('button', { name: 'Edward' })).toBeVisible();
});

test('unauthenticated visitors are redirected away from the app', async ({ page }) => {
  await page.goto('/dashboard');
  await page.waitForURL('**/login');
  await expect(page.getByRole('button', { name: 'Edward' })).toBeVisible();
});
