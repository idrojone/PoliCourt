package com.policourt.springboot.booking.application.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Excepción lanzada cuando existe un conflicto al intentar crear o actualizar una reserva,
 * generalmente debido a solapamientos horarios o indisponibilidad de la pista.
 */
@ResponseStatus(HttpStatus.CONFLICT) // Devuelve 409
public class BookingConflictException extends RuntimeException {

    /**
     * Construye una nueva excepción con el mensaje de error detallado.
     * @param message Mensaje que describe el conflicto específico.
     */
    public BookingConflictException(String message) {
        super(message);
    }
}
