-- V6__Adjust_Booking_Exclusion_Constraint.sql
-- Actualiza la lógica de exclusión para no bloquear bookings PENDING.

-- 1) Aseguramos valor SUCCESS en enum si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'booking_status_enum'
          AND e.enumlabel = 'SUCCESS'
    ) THEN
        ALTER TYPE booking_status_enum ADD VALUE 'SUCCESS';
    END IF;
END $$;

-- 2) Reemplazar constraint de la tabla bookings para excluir solo estados definitivos y activos.
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_court_id_tstzrange_excl;

ALTER TABLE bookings
    ADD CONSTRAINT bookings_court_id_tstzrange_excl
    EXCLUDE USING GIST (
        court_id WITH =,
        tstzrange(start_time, end_time, '[)') WITH &&
    )
    WHERE (status IN ('CONFIRMED','SUCCESS','COMPLETED') AND is_active = true);
