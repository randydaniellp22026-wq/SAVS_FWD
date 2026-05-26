/**
 * Prepara usuario de prueba E2E con contraseña hasheada en MySQL.
 * Uso: node scripts/e2ePrepareUser.js
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, Usuario, Rol } = require('../models');

const E2E_EMAIL = (process.env.E2E_USER_EMAIL || 'e2e@savs.test').toLowerCase();
const E2E_PASSWORD = process.env.E2E_USER_PASSWORD || 'E2eTest123!';
const E2E_NAME = 'Usuario E2E Smoke';

async function main() {
  await sequelize.authenticate();
  const [rol] = await Rol.findOrCreate({ where: { nombre: 'Cliente' } });
  const hashed = await bcrypt.hash(E2E_PASSWORD, 10);

  const [user, created] = await Usuario.findOrCreate({
    where: { email: E2E_EMAIL },
    defaults: {
      id: 'e2e_smoke_user',
      nombre: E2E_NAME,
      email: E2E_EMAIL,
      password: hashed,
      rolId: rol.id,
    },
  });

  if (!created) {
    await user.update({ password: hashed, nombre: E2E_NAME });
  }

  console.log(`E2E user ready: ${E2E_EMAIL}`);
  await sequelize.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
