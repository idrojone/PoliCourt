package com.policourt.springboot.booking.presentation.request;

import com.policourt.springboot.booking.domain.model.BookingType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record CreateBookingRequest(
    @NotNull(message = "El Slug de la pista no puede ser nulo")
    String courtSlug,

    @NotNull(message = "El nombre de usuario del organizador no puede ser nulo")
    String organizerUsername,

    @NotNull(message = "El tipo de reserva no puede ser nulo") BookingType type,

    String title,
    String description,

    @NotNull(message = "La hora de inicio no pude ser nula")
    @FutureOrPresent(
        message = "La hora de inicio debe ser en el presente o futuro"
    )
    LocalDateTime startTime,

    @NotNull(message = "La hora de fin no puede ser nula")
    @Future(message = "La hora de fin debe ser en el futuro")
    LocalDateTime endTime
) {}
