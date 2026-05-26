require('./loadEnv');
const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

const MAX_DB_RETRIES = Number(process.env.DB_MAX_RETRIES || 5);
const RETRY_BASE_MS = Number(process.env.DB_RETRY_BASE_MS || 1000);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectWithRetry = async () => {
  for (let attempt = 1; attempt <= MAX_DB_RETRIES; attempt += 1) {
    try {
      await sequelize.authenticate();
      logger.info({ attempt }, 'Conexión a MySQL establecida');
      return true;
    } catch (error) {
      const delayMs = RETRY_BASE_MS * 2 ** (attempt - 1);
      logger.error(
        { attempt, maxAttempts: MAX_DB_RETRIES, delayMs, error: error.message },
        'Fallo al conectar a MySQL'
      );
      if (attempt === MAX_DB_RETRIES) {
        return false;
      }
      await wait(delayMs);
    }
  }
  return false;
};

// ─────────────────────────────────────────────
// Arrancar servidor (solo si no estamos en entorno de test)
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectWithRetry().then((connected) => {
    if (!connected) {
      logger.fatal('No se pudo iniciar el servidor: base de datos no disponible');
      process.exit(1);
    }
    app.listen(PORT, () => {
      logger.info({ port: PORT }, 'Servidor iniciado');
    });
  });
}

module.exports = app;
