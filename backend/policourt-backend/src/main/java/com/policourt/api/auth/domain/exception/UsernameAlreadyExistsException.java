package com.policourt.api.auth.domain.exception;

public class UsernameAlreadyExistsException extends RuntimeException {

    public UsernameAlreadyExistsException(String username) {
        super("El nombre de usuario ya está en uso: " + username);
    }
}
