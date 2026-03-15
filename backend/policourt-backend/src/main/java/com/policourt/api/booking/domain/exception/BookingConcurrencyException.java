package com.policourt.api.booking.domain.exception;

public class BookingConcurrencyException extends RuntimeException {
    public BookingConcurrencyException() {
        super("Alta concurrencia, reintenta");
    }
}
