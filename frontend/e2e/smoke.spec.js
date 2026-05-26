import { test, expect } from '@playwright/test';
import { E2E_USER, loginViaUi } from './helpers/auth.js';

test.describe('Smoke tests SAVS', () => {
  test('login de usuario', async ({ page }) => {
    await loginViaUi(page);
  });

  test('navegación del catálogo con filtros', async ({ page }) => {
    await page.goto('/inventory');
    await expect(page.getByRole('main')).toBeVisible({ timeout: 15_000 });

    const searchInput = page.getByPlaceholder(/buscar/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Toyota');
      await page.waitForLoadState('networkidle');
    }

    await expect(page.getByRole('heading', { name: /catálogo premium/i })).toBeVisible();
  });

  test('envío de solicitud de contacto', async ({ page }) => {
    await loginViaUi(page);

    await page.goto('/contact');
    await expect(page.locator('form.formulario')).toBeVisible({ timeout: 15_000 });

    await page.getByPlaceholder(/nombre y apellidos/i).fill('Usuario E2E Smoke');
    await page.getByPlaceholder(/correo electrónico/i).fill(E2E_USER.email);
    await page.getByPlaceholder(/teléfono/i).fill('+506 8888 8888');
    await page.locator('select[name="subject"]').selectOption('Consulta General');
    await page.getByPlaceholder(/describe detalladamente/i).fill(
      'Mensaje de prueba automatizada E2E con más de diez caracteres.'
    );

    await page.getByRole('button', { name: /enviar mensaje/i }).click();

    await expect(page.locator('.swal2-popup')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/solicitud enviada/i)).toBeVisible();
  });
});
