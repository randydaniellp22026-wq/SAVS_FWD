# ============================================================
# Dockerfile — Frontend (Multi-stage build)
# Proyecto: The Destiny Vault / Importadora SAVS
#
# USO:
#   docker build -t savs-frontend -f frontend/Dockerfile frontend/
#   docker run -p 80:80 savs-frontend
#
# O bien vía docker compose:
#   docker compose up frontend
# ============================================================

# ──── Etapa 1: Build de la aplicación React+Vite ────
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias primero para aprovechar caché de capas
COPY package*.json ./
RUN npm ci

# Copiar código fuente y construir
COPY . .
RUN npm run build

# ──── Etapa 2: Servir con Nginx ────
FROM nginx:alpine

# Copiar el build de Vite al directorio público de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (SPA + proxy API)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
