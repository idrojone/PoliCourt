package com.policourt.springboot.sport.domain.exception;

public class SportAlreadyExistsException extends RuntimeException {
    public SportAlreadyExistsException(String message) {
        super(message);
    }
}
