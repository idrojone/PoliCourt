package com.policourt.springboot.court.presentation.request;

import java.util.List;

import com.policourt.springboot.court.domain.enums.CourtSurface;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos requeridos para crear una nueva pista")
public record CourtRequest(
        @Schema(description = "Nombre de la pista", example = "Pista Central") String name,

        @Schema(description = "Ubicación de la pista", example = "Calle Falsa 123, Ciudad") String locationDetails,

        @Schema(description = "URL de la imagen representativa", example = "https://policourt.com/images/court1.jpg") String imgUrl,

        @Schema(description = "Precio por hora", example = "50.0") Double priceH,

        @Schema(description = "Capacidad de la pista", example = "5000") Integer capacity,

        @Schema(description = "Indica si la pista es cubierta", example = "true") Boolean isIndoor,

        @Schema(description = "Superficie de la pista", example = "HARD") CourtSurface surface,

        @Schema(description = "Lista de deportes disponibles en la pista", example = "[\"TENNIS\", \"SQUASH\"]") List<String> sports

) {
} 
