import { test, expect } from '@playwright/test';
import { hasE2eBackend, signInAs } from './helpers';

test.describe('task attribution (spec §55)', () => {
  test.skip(!hasE2eBackend(), 'Requires a configured E2E Supabase project — see tests/e2e/README.md');

  test('Vale creates a task, then Edward edits it — both are attributed correctly', async ({ page }) => {
    await signInAs(page, process.env.E2E_VALE_EMAIL!);

    const title = `Tarea E2E ${Date.now()}`;
    await page.goto('/tasks');
    await page.getByLabel('Nueva tarea').fill(title);
    await page.getByLabel('Nueva tarea').press('Enter');

    const taskRow = page.getByText(title).locator('..').locator('..');
    await expect(taskRow.getByText('Creado por Vale')).toBeVisible();

    // Switch to Edward and edit the same task.
    await page.getByRole('button', { name: 'Cambiar perfil' }).click();
    await page.waitForURL('**/login');
    await signInAs(page, process.env.E2E_EDWARD_EMAIL!);

    await page.goto('/tasks');
    await page.getByText(title).click();
    await page.getByLabel('Título *').fill(`${title} (editado)`);
    await page.getByRole('button', { name: 'Guardar' }).click();

    const updatedRow = page.getByText(`${title} (editado)`).locator('..').locator('..');
    await expect(updatedRow.getByText(/Modificado por Edward/)).toBeVisible();
  });
});
