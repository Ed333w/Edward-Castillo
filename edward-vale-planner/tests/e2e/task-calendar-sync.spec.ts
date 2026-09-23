import { test, expect } from '@playwright/test';
import { hasE2eBackend, signInAs } from './helpers';

test.describe('task <-> calendar sync (spec §9/§55)', () => {
  test.skip(!hasE2eBackend(), 'Requires a configured E2E Supabase project — see tests/e2e/README.md');

  test('a task with a due date appears on the calendar, moves, and disappears when completed', async ({ page }) => {
    await signInAs(page, process.env.E2E_EDWARD_EMAIL!);

    const title = `Sync E2E ${Date.now()}`;
    await page.goto('/tasks');
    await page.getByLabel('Nueva tarea').fill(title);
    await page.getByLabel('Nueva tarea').press('Enter');

    await page.getByText(title).click();
    const today = new Date().toISOString().slice(0, 10);
    await page.getByLabel('Fecha').fill(today);
    await page.getByRole('button', { name: 'Guardar' }).click();

    await page.goto('/calendar');
    await expect(page.getByRole('button', { name: title })).toBeVisible();

    // Completing it in the task list should be reflected on the calendar
    // without creating a second, separate event.
    await page.goto('/tasks');
    await page.getByLabel(`Marcar "${title}" como completada`).check();

    await page.goto('/calendar');
    await expect(page.getByRole('button', { name: title })).toHaveClass(/line-through/);
  });
});
