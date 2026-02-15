package com.policourt.api.club.domain.exception;

public class ClubAlreadyExistsException extends RuntimeException {
    public ClubAlreadyExistsException(String name) {
        super(String.format("Ya existe un club con el nombre: %s", name));
    }
}
