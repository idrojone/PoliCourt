package com.policourt.springboot.booking.presentation.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Request específico para actualizar reservas de tipo RENTAL.
 * Solo se pueden modificar las horas, el precio se recalcula automáticamente.
 * No se puede cambiar: courtSlug, organizerUsername (ni title/description porque no aplican).
 */
@Schema(description = "Datos para actualizar una reserva de alquiler de pista")
public record UpdateRentalRequest(
    @Schema(
        description = "Nueva fecha y hora de inicio",
        example = "2026-02-15T10:00:00"
    )
    @NotNull(message = "La hora de inicio no puede ser nula")
    @FutureOrPresent(message = "La hora de inicio debe ser en el presente o futuro")
    LocalDateTime startTime,

    @Schema(
        description = "Nueva fecha y hora de fin",
        example = "2026-02-15T12:00:00"
    )
    @NotNull(message = "La hora de fin no puede ser nula")
    @Future(message = "La hora de fin debe ser en el futuro")
    LocalDateTime endTime
) {}
