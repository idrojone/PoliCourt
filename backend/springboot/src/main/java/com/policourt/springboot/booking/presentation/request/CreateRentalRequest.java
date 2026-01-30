package com.policourt.springboot.booking.presentation.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * Request específico para crear reservas de tipo RENTAL (alquiler de pista).
 * No requiere título ni descripción, se generan automáticamente.
 * El precio se calcula según el priceH de la pista × horas reservadas.
 */
@Schema(description = "Datos para crear una reserva de alquiler de pista")
public record CreateRentalRequest(
    @Schema(
        description = "Slug de la pista a reservar",
        example = "pista-central-1"
    )
    @NotNull(message = "El Slug de la pista no puede ser nulo")
    String courtSlug,

    @Schema(
        description = "Username del usuario que realiza la reserva",
        example = "john.doe"
    )
    @NotNull(message = "El nombre de usuario del organizador no puede ser nulo")
    String organizerUsername,

    @Schema(
        description = "Fecha y hora de inicio de la reserva",
        example = "2026-02-15T10:00:00"
    )
    @NotNull(message = "La hora de inicio no puede ser nula")
    @FutureOrPresent(message = "La hora de inicio debe ser en el presente o futuro")
    LocalDateTime startTime,

    @Schema(
        description = "Fecha y hora de fin de la reserva",
        example = "2026-02-15T12:00:00"
    )
    @NotNull(message = "La hora de fin no puede ser nula")
    @Future(message = "La hora de fin debe ser en el futuro")
    LocalDateTime endTime
) {}
