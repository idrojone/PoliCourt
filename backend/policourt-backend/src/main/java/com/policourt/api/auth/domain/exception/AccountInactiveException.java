package com.policourt.api.auth.domain.exception;

public class AccountInactiveException extends RuntimeException {
    public AccountInactiveException() {
        super("La cuenta no está activa o no ha sido publicada. Contacta con el administrador.");
    }
}
