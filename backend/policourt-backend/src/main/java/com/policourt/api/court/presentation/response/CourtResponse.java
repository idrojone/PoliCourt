
package com.policourt.api.court.presentation.response;

import java.math.BigDecimal;
import java.util.List;

import com.policourt.api.court.domain.enums.CourtSurfaceEnum;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.presentation.response.SportResponse;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos públicos de la pista")
public record CourtResponse(
        @Schema(description = "Nombre de la pista", example = "Pista Central") String name,
        @Schema(description = "Slug único para URLs", example = "pista-central") String slug,
        @Schema(description = "Detalles de ubicación", example = "Calle Principal 123") String locationDetails,
        @Schema(description = "URL de la imagen", example = "https://example.com/court.jpg") String imgUrl,
        @Schema(description = "Precio por hora", example = "25.00") BigDecimal priceH,
        @Schema(description = "Capacidad de personas", example = "10") Integer capacity,
        @Schema(description = "Si es cubierta o no", example = "true") Boolean isIndoor,
        @Schema(description = "Tipo de superficie", example = "CLAY") CourtSurfaceEnum surface,
        @Schema(description = "Lista de deportes asociados") List<SportResponse> sports,
        @Schema(description = "Estado actual", example = "PUBLISHED") GeneralStatus status,
        @Schema(description = "Si está activa", example = "true") Boolean isActive) {
}
