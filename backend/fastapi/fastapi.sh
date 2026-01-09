#!/usr/bin/env bash
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
# wait-for-it.sh ${POSTGRES_HOST}:${POSTGRES_PORT} --timeout=30 --strict -- echo "✅ Database is ready!"

echo "🚀 Running Alembic migrations..."
# alembic upgrade head

echo "🚀 Starting FastAPI..."
exec python main.py