package com.policourt.api.booking.domain.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super(String.format("Usuario no encontrado con username: %s", username));
    }
}
