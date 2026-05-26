import { expect } from '@playwright/test';

export const E2E_USER = {
  email: process.env.E2E_USER_EMAIL || 'e2e@savs.test',
  password: process.env.E2E_USER_PASSWORD || 'E2eTest123!',
};

export async function loginViaUi(page, user = E2E_USER) {
  await page.goto('/login');
  await page.locator('#email').fill(user.email);
  await page.locator('#password').fill(user.password);
  await page.getByRole('button', { name: /iniciar sesión/i }).click();

  // Tras login exitoso, la app muestra SweetAlert y solo navega al confirmar
  const swalConfirm = page.locator('.swal2-confirm');
  await swalConfirm.waitFor({ state: 'visible', timeout: 15_000 });
  await swalConfirm.click();

  await expect(page).not.toHaveURL(/\/login$/, { timeout: 15_000 });
  await expect(page.locator('body')).not.toContainText('Credenciales inválidas');
}

export async function seedSessionInBrowser(page, user = E2E_USER) {
  const apiBase = process.env.PLAYWRIGHT_API_URL || 'http://localhost:5000';
  const res = await page.request.post(`${apiBase}/api/auth/login`, {
    data: { email: user.email, password: user.password },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  const usuario = body.usuario;
  await page.goto('/');
  await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
  });
}
