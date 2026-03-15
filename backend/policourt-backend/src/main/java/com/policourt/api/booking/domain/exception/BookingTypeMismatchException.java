package com.policourt.api.booking.domain.exception;

public class BookingTypeMismatchException extends RuntimeException {
    public BookingTypeMismatchException(String uuid) {
        super(String.format("El booking con uuid %s no corresponde al tipo solicitado", uuid));
    }
}
