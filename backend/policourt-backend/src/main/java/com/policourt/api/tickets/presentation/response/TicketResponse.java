package com.policourt.api.tickets.presentation.response;

import java.time.OffsetDateTime;

import com.policourt.api.tickets.domain.enums.TicketStatusEnum;
import com.policourt.api.tickets.domain.enums.TicketTypeEnum;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Información pública de un ticket")
public record TicketResponse(
        @Schema(description = "Código del ticket", example = "TCK-123") String code,
        @Schema(description = "Tipo de ticket") TicketTypeEnum type,
        @Schema(description = "Estado de ticket") TicketStatusEnum status,
        @Schema(description = "Fecha de creación") OffsetDateTime createdAt) {
}
