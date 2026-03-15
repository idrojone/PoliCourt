package com.policourt.api.booking.presentation.response;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.club.presentation.response.ClubResponse;
import com.policourt.api.court.presentation.response.CourtResponse;
import com.policourt.api.sport.presentation.response.SportResponse;
import com.policourt.api.user.presentation.response.UserResponse;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Información pública de una reserva")
public record BookingResponse(
        @Schema(description = "UUID de la reserva", example = "20dd7d9a-5e22-4b6b-a3cd-2a564874f7c1") String uuid,
        @Schema(description = "Tipo de reserva") BookingTypeEnum type,
        @Schema(description = "Pista reservada") CourtResponse court,
        @Schema(description = "Usuario organizador") UserResponse organizer,
        @Schema(description = "Deporte") SportResponse sport,
        @Schema(description = "Club (solo para trainings)") ClubResponse club,
        @Schema(description = "Título (solo para clases)", example = "Clase de defensa personal") String title,
        @Schema(description = "Descripción (solo para clases)", example = "Clase grupal enfocada en técnicas básicas") String description,
        @Schema(description = "Precio total") BigDecimal totalPrice,
        @Schema(description = "Precio por asistente (clases / trainings)") BigDecimal attendeePrice,
        @Schema(description = "Fecha/hora de inicio") OffsetDateTime startTime,
        @Schema(description = "Fecha/hora de fin") OffsetDateTime endTime,
        @Schema(description = "Estado de la reserva") BookingStatusEnum status,
        @Schema(description = "Si la reserva está activa") Boolean isActive,
        @Schema(description = "Fecha de creación") OffsetDateTime createdAt,
        @Schema(description = "Fecha de última actualización") OffsetDateTime updatedAt) {
}
