# --- Stage 1: Build the Frontend ---
FROM node:22-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Build the Backend & Final Image ---
FROM node:22-alpine
WORKDIR /app

# Install production dependencies for the backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source and the built frontend from Stage 1
COPY backend/ ./
COPY --from=build-frontend /app/frontend/dist ./public

# Render expects the app to listen on a port provided by environment variable
ENV PORT=10000
EXPOSE 10000

CMD ["node", "server.js"]