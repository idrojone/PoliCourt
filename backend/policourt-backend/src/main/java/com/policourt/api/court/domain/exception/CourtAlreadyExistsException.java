package com.policourt.api.court.domain.exception;

public class CourtAlreadyExistsException extends RuntimeException {
    public CourtAlreadyExistsException(String name) {
        super("La pista ya existe: " + name);
    }
}
