package com.policourt.api.booking.domain.exception;

public class SportNotAllowedForCourtException extends RuntimeException {
    public SportNotAllowedForCourtException() {
        super("Deporte no permitido en esa pista");
    }
}
