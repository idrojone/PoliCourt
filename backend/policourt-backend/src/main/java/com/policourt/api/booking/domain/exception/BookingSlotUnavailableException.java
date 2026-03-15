package com.policourt.api.booking.domain.exception;

public class BookingSlotUnavailableException extends RuntimeException {
    public BookingSlotUnavailableException() {
        super("Slot ya reservado");
    }
}
