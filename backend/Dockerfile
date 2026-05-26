# ============================================================
# Dockerfile — Backend (Node.js + Express)
# Proyecto: The Destiny Vault / Importadora SAVS
#
# USO:
#   docker build -t savs-backend -f backend/Dockerfile backend/
#   docker run -p 5000:5000 --env-file .env savs-backend
#
# O bien vía docker compose:
#   docker compose up backend
# ============================================================

FROM node:20-alpine
WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente del backend
COPY . .

# Crear directorio de uploads si no existe
RUN mkdir -p uploads

EXPOSE 5000

# Arrancar el servidor Node.js (usa server.js como punto de entrada)
CMD ["node", "server.js"]
