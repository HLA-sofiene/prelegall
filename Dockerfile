# Stage 1: Build Next.js static export
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
# Disable strict SSL for npm on corporate networks with TLS-intercepting proxies
RUN npm config set strict-ssl false && npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python/FastAPI backend serving the static frontend
FROM python:3.12-slim AS backend

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Use native TLS so uv trusts the system CA store (required on corporate networks
# that use a TLS-intercepting proxy)
ENV UV_NATIVE_TLS=1

# Install backend dependencies (leverages layer cache when pyproject.toml unchanged)
COPY backend/pyproject.toml backend/uv.lock* ./backend/
RUN cd backend && uv sync --frozen --no-cache --no-dev

# Copy backend source
COPY backend/app ./backend/app

# Copy Next.js static export from the frontend build stage
COPY --from=frontend-builder /app/out ./backend/frontend_static

EXPOSE 8000

WORKDIR /app/backend
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
