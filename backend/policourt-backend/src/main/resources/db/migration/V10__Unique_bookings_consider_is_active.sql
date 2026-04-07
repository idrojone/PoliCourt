-- V10__Unique_bookings_consider_is_active.sql
-- Ajusta el índice único para que solo aplique a reservas activas (is_active = true).
-- Esto evita conflictos por reservas históricas o inactivas que antes disparaban un UNIQUE INDEX.

BEGIN;

-- Elimina índices antiguos que podrían existir.
DROP INDEX IF EXISTS uq_bookings_court_time_active;
DROP INDEX IF EXISTS uq_bookings_court_time;

-- Crea un índice único parcial que solo afecta a reservas activas.
CREATE UNIQUE INDEX IF NOT EXISTS uq_bookings_court_time_active
    ON bookings (court_id, start_time, end_time)
    WHERE (is_active = true AND status != 'CANCELLED' AND status != 'COMPLETED');

COMMIT;
