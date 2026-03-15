package com.policourt.api.booking.presentation.request;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Solicitud para crear una reserva de tipo class")
public class BookingClassCreateRequest {

    @Schema(description = "Slug de la pista")
    @NotBlank(message = "courtSlug es obligatorio")
    private String courtSlug;

    @Schema(description = "Username del organizador")
    @NotBlank(message = "organizerUsername es obligatorio")
    private String organizerUsername;

    @Schema(description = "Slug del deporte")
    @NotBlank(message = "sportSlug es obligatorio")
    private String sportSlug;

    @Schema(description = "Título de la clase")
    @NotBlank(message = "title es obligatorio")
    private String title;

    @Schema(description = "Descripción de la clase")
    private String description;

    @Schema(description = "Precio total")
    private BigDecimal totalPrice;

    @Schema(description = "Precio por asistente")
    private BigDecimal attendeePrice;

    @Schema(description = "Fecha/hora de inicio")
    @NotNull(message = "startTime es obligatorio")
    private OffsetDateTime startTime;

    @Schema(description = "Fecha/hora de fin")
    @NotNull(message = "endTime es obligatorio")
    private OffsetDateTime endTime;
}
