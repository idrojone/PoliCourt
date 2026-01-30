-- V9__Add_Attendee_Price_To_Bookings.sql
-- Agrega el campo attendee_price para almacenar el precio que paga cada asistente
-- por inscribirse a una clase (booking type = CLASS).

ALTER TABLE bookings
ADD COLUMN attendee_price DECIMAL(10, 2) DEFAULT 0;

COMMENT ON COLUMN bookings.attendee_price IS 'Precio que debe pagar cada asistente por inscribirse (aplica principalmente a CLASS)';
