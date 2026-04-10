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

# Install uv (used only to run the app, not to download packages)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Install Python dependencies via pip with --trusted-host so the corporate
# TLS-intercepting proxy does not cause certificate errors
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir \
      --trusted-host pypi.org \
      --trusted-host files.pythonhosted.org \
      --trusted-host pypi.python.org \
      -r backend/requirements.txt

# Copy backend source
COPY backend/pyproject.toml backend/uv.lock* ./backend/
COPY backend/app ./backend/app

# Copy Next.js static export from the frontend build stage
COPY --from=frontend-builder /app/out ./backend/frontend_static

EXPOSE 8000

WORKDIR /app/backend
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
