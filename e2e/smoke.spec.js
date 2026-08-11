import { test, expect } from '@playwright/test';

test('landing renders both title cards', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Noah' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'PACIFIC' })).toBeVisible();
});

test('deep links resolve (SPA fallback)', async ({ page }) => {
  await page.goto('/noah');
  await expect(page).toHaveURL(/\/noah$/);

  await page.goto('/pacific');
  await expect(page).toHaveURL(/\/pacific$/);
});
