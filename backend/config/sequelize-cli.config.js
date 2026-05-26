'use strict';

/**
 * Config para sequelize-cli (migraciones/seed). Debe estar en el repo porque
 * `config/config.json` está en .gitignore y en CI solo existen las env vars de DB.
 * Lógica alineada con models/index.js: JSON opcional + override por env en dev/test.
 */
const fs = require('fs');
const path = require('path');

require('../loadEnv');

/**
 * @param {'development' | 'test' | 'production'} envName
 * @returns {import('sequelize').Options}
 */
function buildEnvConfig(envName) {
  const configPath = path.join(__dirname, 'config.json');
  /** @type {import('sequelize').Options | null | undefined} */
  let fromFile;

  try {
    if (fs.existsSync(configPath)) {
      const all = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      fromFile = all[envName];
    }
  } catch {
    fromFile = null;
  }

  if (!fromFile) {
    return {
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD ?? process.env.DB_PASS ?? '',
      database: process.env.DB_NAME || 'the_destiny_vault',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: false,
    };
  }

  if (envName === 'development' || envName === 'test') {
    return {
      ...fromFile,
      username: process.env.DB_USER || fromFile.username,
      password:
        process.env.DB_PASSWORD ??
        process.env.DB_PASS ??
        fromFile.password ??
        '',
      database: process.env.DB_NAME || fromFile.database,
      host: process.env.DB_HOST || fromFile.host,
      port: Number(process.env.DB_PORT) || fromFile.port || 3306,
    };
  }

  return fromFile;
}

module.exports = {
  development: buildEnvConfig('development'),
  test: buildEnvConfig('test'),
  production: buildEnvConfig('production'),
};
