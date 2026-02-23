#!/usr/bin/env bash
set -e

# esperar a la base de datos
./wait-for-it.sh db:5432 -- echo "[springboot] database ready"

# ejecutar migraciones con flyway usando maven instalado
echo "[springboot] running flyway migrations"
mvn flyway:migrate -Dflyway.url="${FLYWAY_URL}" -Dflyway.user="${FLYWAY_USER}" -Dflyway.password="${FLYWAY_PASSWORD}"

# finalmente arrancar la aplicación
echo "[springboot] starting application"
java -jar /app/app.jar
