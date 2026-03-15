package com.policourt.api.booking.domain.exception;

public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(String uuid) {
        super(String.format("No se encontró la reserva con uuid: %s", uuid));
    }
}
