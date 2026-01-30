-- V8: Eliminar el valor TOURNAMENT del enum booking_type_enum
-- Los torneos ya no son soportados en la aplicación

-- Primero, eliminar cualquier reserva de tipo TOURNAMENT (si existe)
DELETE FROM bookings WHERE type = 'TOURNAMENT';

-- En PostgreSQL no se puede eliminar un valor de un ENUM directamente.
-- La estrategia es: crear nuevo tipo, migrar columna, eliminar viejo tipo.

-- 1. Crear el nuevo enum sin TOURNAMENT
CREATE TYPE booking_type_enum_new AS ENUM ('RENTAL', 'CLASS', 'TRAINING');

-- 2. Eliminar el DEFAULT de la columna (usa el enum viejo)
ALTER TABLE bookings ALTER COLUMN type DROP DEFAULT;

-- 3. Alterar la columna para usar el nuevo tipo
ALTER TABLE bookings 
    ALTER COLUMN type TYPE booking_type_enum_new 
    USING type::text::booking_type_enum_new;

-- 4. Restaurar el DEFAULT con el nuevo tipo
ALTER TABLE bookings ALTER COLUMN type SET DEFAULT 'RENTAL'::booking_type_enum_new;

-- 5. Eliminar el enum viejo
DROP TYPE booking_type_enum;

-- 6. Renombrar el nuevo enum al nombre original
ALTER TYPE booking_type_enum_new RENAME TO booking_type_enum;
