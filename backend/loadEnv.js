/**
 * Carga variables desde backend/.env y, si no existen, desde la raíz del repo (../.env).
 * Debe importarse antes que cualquier módulo que use process.env.
 */
const path = require('path');
const dotenv = require('dotenv');

const envPaths = [
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env'),
];

for (const envPath of envPaths) {
    dotenv.config({ path: envPath });
}

if (process.env.GROQ_API_KEY) {
    process.env.GROQ_API_KEY = process.env.GROQ_API_KEY.trim();
}
