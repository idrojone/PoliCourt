package com.policourt.springboot.booking.presentation.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request para actualizar el estado activo/inactivo de una reserva")
public record UpdateBookingActiveRequest(
    @NotNull(message = "El campo isActive no puede ser nulo")
    @Schema(description = "Estado activo de la reserva (true = activa, false = desactivada)", example = "false")
    Boolean isActive
) {}
