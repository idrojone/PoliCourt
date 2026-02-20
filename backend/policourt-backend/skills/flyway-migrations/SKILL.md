---
name: flyway-migrations
description: Úsala cuando necesites hacer un cambio en la estructura de la base de datos (crear tablas, añadir columnas, etc.).
---

# Convenciones de Migración de Base de Datos

1. Las migraciones están en `src/main/resources/db/migration`.
2. **PROHIBIDO** modificar un archivo `.sql` existente (ej. `V1__Initial_Schema.sql`).
3. Si necesitas cambiar el esquema, debes crear un nuevo archivo sumando 1 al último número de versión.
4. Nomenclatura: `V{NUMERO}__Descripcion_Corta.sql` (ejemplo: `V3__Add_Status_To_Booking.sql`).
5. Escribe código SQL estándar compatible con el motor de base de datos actual.