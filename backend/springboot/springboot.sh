#!/usr/bin/env bash
set -e

echo "⏳ Waiting for PostgreSQL to be ready..."
/usr/bin/env bash /usr/local/bin/wait-for-it.sh "${POSTGRES_HOST}:${POSTGRES_PORT}" --timeout=30 --strict -- echo "✅ Database is ready!"

echo "🚀 Starting Spring Boot application..."
exec java -jar /app/app.jar