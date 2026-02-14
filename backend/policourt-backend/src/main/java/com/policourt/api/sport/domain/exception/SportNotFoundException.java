package com.policourt.api.sport.domain.exception;

public class SportNotFoundException extends RuntimeException {
    public SportNotFoundException(String identifier) {
        super("Deporte no encontrado: " + identifier);
    }
}
