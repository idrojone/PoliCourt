package com.policourt.springboot.booking.presentation.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Request para actualizar reservas de tipo CLASS o TRAINING.
 * No se puede cambiar: courtSlug, organizerUsername, type.
 * Si cambia el título, se regenera el slug.
 * Si cambian las horas, se recalcula el precio (para RENTAL).
 */
@Schema(
    description = "Datos para actualizar una reserva de clase o entrenamiento"
)
public record UpdateBookingRequest(
    @Schema(
        description = "Nuevo título de la reserva. Si cambia, se regenera el slug.",
        example = "Clase de tenis avanzado"
    )
    String title,

    @Schema(
        description = "Nueva descripción de la reserva",
        example = "Clase intensiva para nivel avanzado"
    )
    String description,

    @Schema(description = "Nuevo precio por asistente", example = "10.00")
    @PositiveOrZero(
        message = "El precio por asistente debe ser cero o positivo"
    )
    BigDecimal attendeePrice,

    @Schema(
        description = "Nueva fecha y hora de inicio",
        example = "2026-02-15T10:00:00"
    )
    @NotNull(message = "La hora de inicio no puede ser nula")
    @FutureOrPresent(
        message = "La hora de inicio debe ser en el presente o futuro"
    )
    LocalDateTime startTime,

    @Schema(
        description = "Nueva fecha y hora de fin",
        example = "2026-02-15T12:00:00"
    )
    @NotNull(message = "La hora de fin no puede ser nula")
    @Future(message = "La hora de fin debe ser en el futuro")
    LocalDateTime endTime
) {}
