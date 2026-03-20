package com.policourt.api.booking.presentation.response;

import java.time.OffsetDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Intervalo ocupado de una pista")
public record BookedSlotResponse(
        @Schema(description = "Fecha y hora de inicio de la reserva") OffsetDateTime startTime,
        @Schema(description = "Fecha y hora de fin de la reserva") OffsetDateTime endTime) {
}