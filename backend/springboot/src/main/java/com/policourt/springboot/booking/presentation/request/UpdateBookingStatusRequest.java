package com.policourt.springboot.booking.presentation.request;

import com.policourt.springboot.booking.domain.model.BookingStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request para actualizar el estado de una reserva")
public record UpdateBookingStatusRequest(
    @NotNull(message = "El nuevo estado no puede ser nulo")
    @Schema(description = "Nuevo estado de la reserva", example = "CANCELLED")
    BookingStatus status
) {}
