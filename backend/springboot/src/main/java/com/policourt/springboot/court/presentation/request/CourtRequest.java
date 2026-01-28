package com.policourt.springboot.court.presentation.request;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.List;

@Schema(description = "Datos requeridos para crear una nueva pista")
public record CourtRequest(
    @Schema(description = "Nombre de la pista", example = "Pista Central")
    String name,

    @Schema(
        description = "Ubicación de la pista",
        example = "Calle Falsa 123, Ciudad"
    )
    String locationDetails,

    @Schema(
        description = "URL de la imagen representativa",
        example = "https://policourt.com/images/court1.jpg"
    )
    String imgUrl,

    @Schema(description = "Precio por hora", example = "50.0")
    BigDecimal priceH,

    @Schema(description = "Capacidad de la pista", example = "5000")
    Integer capacity,

    @Schema(description = "Indica si la pista es cubierta", example = "true")
    Boolean isIndoor,

    @Schema(description = "Superficie de la pista", example = "HARD")
    CourtSurface surface,

    @Schema(description = "Estado de la pista", example = "PUBLISHED")
    CourtStatus status,

    @Schema(
        description = "Lista de deportes disponibles en la pista",
        example = "[\"TENNIS\", \"SQUASH\"]"
    )
    List<String> sports
) {}
