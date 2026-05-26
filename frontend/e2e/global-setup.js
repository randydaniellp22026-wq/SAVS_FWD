import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, '../../backend');

export default async function globalSetup() {
  try {
    execSync('node scripts/e2ePrepareUser.js', {
      cwd: backendDir,
      stdio: 'inherit',
      env: { ...process.env },
    });
  } catch (err) {
    console.warn(
      '[e2e] No se pudo preparar usuario en BD. Asegúrate de que MySQL y el backend estén activos.',
      err.message
    );
  }
}
