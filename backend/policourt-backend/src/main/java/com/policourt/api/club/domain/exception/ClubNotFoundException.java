package com.policourt.api.club.domain.exception;

public class ClubNotFoundException extends RuntimeException {
    public ClubNotFoundException(String identifier) {
        super(String.format("No se encontró el club con el identificador: %s", identifier));
    }
}
