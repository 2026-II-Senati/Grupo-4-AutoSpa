# Imagen de la aplicación AutoSpa: frontend React compilado + API Express.
# Se construye desde la raíz del repositorio con: docker compose build app
# Guía: docs/instalacion.md, sección 9.

# ---- Base: versiones acordadas por el proyecto ----
FROM node:24.22.1-bookworm-slim AS base
RUN npm install -g npm@11.19.1

# ---- Etapa 1: compilar el frontend ----
FROM base AS frontend-build
WORKDIR /app/frontend
# Primero solo los manifiestos, para reutilizar la caché si el código cambia y las dependencias no.
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# Docker usa siempre la API real; la demostración solo se activa a propósito.
ARG VITE_USE_MOCK_API=false
ENV VITE_USE_MOCK_API=${VITE_USE_MOCK_API}
RUN npm run build

# ---- Etapa 2: dependencias del backend ----
FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# ---- Etapa final: ejecución ----
FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /app/backend
COPY --from=backend-deps --chown=node:node /app/backend/node_modules ./node_modules
COPY --chown=node:node backend/ ./
# Express sirve el build desde ../../frontend/dist respecto de src/: /app/frontend/dist.
COPY --from=frontend-build --chown=node:node /app/frontend/dist /app/frontend/dist
# No ejecutar como root dentro del contenedor.
USER node
EXPOSE 3001
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=5 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3001/api/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["node", "src/server.js"]
