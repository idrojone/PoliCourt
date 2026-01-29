package com.policourt.springboot.booking.domain.model;

/**
 * Estado de una reserva/evento en el sistema.
 * Refleja el ENUM 'booking_status_enum' de la base de datos.
 */
public enum BookingStatus {
    CONFIRMED,
    PENDING,
    CANCELLED,
    COMPLETED
}
