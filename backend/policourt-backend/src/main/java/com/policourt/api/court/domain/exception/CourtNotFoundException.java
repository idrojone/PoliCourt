package com.policourt.api.court.domain.exception;

public class CourtNotFoundException extends RuntimeException {
    public CourtNotFoundException(String identifier) {
        super("Pista no encontrada: " + identifier);
    }
}
