package com.policourt.api.maintenance.domain.exception;

public class MaintenanceConflictException extends RuntimeException {
    public MaintenanceConflictException() {
        super("La pista está bloqueada por mantenimiento en el horario solicitado");
    }
}
