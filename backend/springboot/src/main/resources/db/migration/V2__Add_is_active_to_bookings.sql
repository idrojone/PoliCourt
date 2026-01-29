-- V2: Agregar campo is_active a la tabla bookings para soft-delete
ALTER TABLE bookings
ADD COLUMN is_active BOOLEAN DEFAULT TRUE NOT NULL;

-- Índice para filtrar reservas activas eficientemente
CREATE INDEX idx_bookings_is_active ON bookings(is_active);
