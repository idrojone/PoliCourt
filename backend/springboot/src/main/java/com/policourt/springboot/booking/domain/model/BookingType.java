package com.policourt.springboot.booking.domain.model;

/**
 * Tipo de reserva/evento en el sistema.
 * Refleja el ENUM 'booking_type_enum' de la base de datos.
 */
public enum BookingType {
    RENTAL,
    CLASS,
    TRAINING,
    TOURNAMENT
}
