# Despliegue en producción — SAVS / The Destiny Vault

Guía para desplegar el sistema sin conocimiento previo del proyecto.

## Arquitectura

| Componente | Tecnología | Puerto por defecto |
|------------|------------|-------------------|
| Frontend | React + Vite | 5173 (dev) / 80-443 (prod) |
| Backend API | Node.js + Express | 5000 |
| Base de datos | MySQL 8+ | 3306 |

## Variables de entorno

### Backend (`The-destiny-vault-/backend/.env`)

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `NODE_ENV` | Sí | `production` |
| `PORT` | No | Puerto HTTP (default `5000`) |
| `DB_HOST` | Sí | Host MySQL |
| `DB_USER` | Sí | Usuario MySQL |
| `DB_PASSWORD` | Sí | Contraseña MySQL |
| `DB_NAME` | Sí | Nombre de la base |
| `JWT_SECRET` | Sí | Secreto para tokens (mín. 32 caracteres aleatorios) |
| `SENTRY_DSN` | Recomendada | DSN de Sentry para errores |
| `RESEND_API_KEY` | Si usa email | API de Resend |
| `CORS_ORIGIN` | Recomendada | URL del frontend en producción |

### Frontend (`The-destiny-vault-/frontend/.env.production`)

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `VITE_API_URL` | Sí | URL pública de la API, ej. `https://api.tudominio.com/api` |
| `VITE_SENTRY_DSN` | Recomendada | DSN Sentry frontend |

## Dominios y TLS

1. Registra dos subdominios: `app.tudominio.com` (frontend) y `api.tudominio.com` (backend).
2. Apunta ambos al balanceador o servidor (registros A/AAAA o CNAME).
3. Emite certificados TLS con **Let's Encrypt** (Certbot) o el proveedor cloud (ACM, Cloudflare).
4. Configura nginx (o Caddy) como reverse proxy:

```nginx
server {
  listen 443 ssl http2;
  server_name app.tudominio.com;
  ssl_certificate     /etc/letsencrypt/live/app.tudominio.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/app.tudominio.com/privkey.pem;
  root /var/www/savs/frontend/dist;
  try_files $uri $uri/ /index.html;
}

server {
  listen 443 ssl http2;
  server_name api.tudominio.com;
  ssl_certificate     /etc/letsencrypt/live/api.tudominio.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.tudominio.com/privkey.pem;
  location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

5. Renueva certificados automáticamente (`certbot renew` en cron).

## Build y despliegue

```bash
# Backend
cd The-destiny-vault-/backend
npm ci --omit=dev
npx sequelize-cli db:migrate
node seed.js   # solo primera vez o entornos de prueba

# Frontend
cd ../frontend
npm ci
npm run build
# Servir carpeta dist/ con nginx
```

Inicia el backend con un gestor de procesos:

```bash
NODE_ENV=production node server.js
# o: pm2 start server.js --name savs-api
```

## Backup de base de datos

Programa backups diarios de MySQL:

```bash
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME \
  | gzip > /backups/savs-$(date +%F).sql.gz
```

- Retención recomendada: 30 días local + copia en S3/GCS cifrada.
- Prueba restauración mensual: `gunzip -c backup.sql.gz | mysql ...`

## Escalar el servicio

| Nivel | Acción |
|-------|--------|
| API | Varias réplicas detrás de load balancer; sesiones stateless (JWT en cookie/header) |
| Node | `pm2 cluster` o Kubernetes Deployment con HPA por CPU |
| MySQL | Réplica de lectura si el catálogo crece; connection pool en Sequelize |
| Estáticos | CDN (Cloudflare) para `dist/` e imágenes `/uploads` |

Métricas en `GET https://api.tudominio.com/metrics` (Prometheus). Dashboard Grafana: ver `docs/GRAFANA.md`.

## Rollback

1. **Frontend**: despliega el artefacto `dist` de la versión anterior (tag git).
2. **Backend**: `git checkout <tag-anterior>`, `npm ci`, reinicia PM2/K8s.
3. **BD**: si hubo migración incompatible, restaura backup previo a la migración y evita `db:migrate` hasta corregir.

```bash
pm2 restart savs-api
# Verificar
curl -f https://api.tudominio.com/
```

## Observabilidad

- **Sentry**: errores frontend/backend automáticos con `SENTRY_DSN` / `VITE_SENTRY_DSN`.
- **Prometheus**: scrape `http://api:5000/metrics` cada 15s.
- **Alertas**: error rate > 1% en Grafana (ver `docs/GRAFANA.md`).

## Smoke tests post-deploy

```bash
cd The-destiny-vault-/frontend
PLAYWRIGHT_BASE_URL=https://app.tudominio.com \
PLAYWRIGHT_API_URL=https://api.tudominio.com \
npm run test:e2e
```

El workflow `.github/workflows/smoke-staging.yml` ejecuta los mismos tests tras cada deploy a staging.
