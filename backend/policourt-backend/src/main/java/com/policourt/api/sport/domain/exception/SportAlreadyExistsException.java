package com.policourt.api.sport.domain.exception;

public class SportAlreadyExistsException extends RuntimeException {
    public SportAlreadyExistsException(String name) {
        super("El deporte ya existe: " + name);
    }
}
