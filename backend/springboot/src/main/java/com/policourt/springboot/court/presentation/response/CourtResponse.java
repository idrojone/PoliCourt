package com.policourt.springboot.court.presentation.response;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import com.policourt.springboot.court.domain.model.Court;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Objects;

public record CourtResponse(
    @Schema(description = "Nombre de la pista", example = "Pista Central")
    String name,

    @Schema(description = "Slug único para URLs", example = "pista-central")
    String slug,

    @Schema(description = "Ubicación de la pista", example = "Calle Falsa 123")
    String location,
    @Schema(
        description = "URL de la imagen de la pista",
        example = "http://example.com/image.jpg"
    )
    String imgUrl,
    @Schema(description = "Precio por hora de la pista", example = "25.5")
    Double priceH,
    @Schema(description = "Capacidad de la pista", example = "10")
    Integer capacity,
    @Schema(description = "Indica si la pista es cubierta", example = "true")
    boolean isIndoor,

    @Schema(description = "Superficie de la pista", example = "HARD")
    CourtSurface surface,

    @Schema(description = "Estado de la pista", example = "PUBLISHED")
    CourtStatus status,

    @Schema(description = "Indica si la pista está activa", example = "true")
    boolean isActive,

    @Schema(
        description = "Lista de deportes disponibles en la pista",
        example = "[\"FUTBOL\", \"BALONCESTO\"]"
    )
    List<String> sportsAvailable
) {
    public static CourtResponse fromDomain(Court court) {
        var sportsAvailable =
            court.getSportCourts() == null
                ? List.<String>of()
                : court
                      .getSportCourts()
                      .stream()
                      .map(cs ->
                          cs.getSport() == null ? null : cs.getSport().getSlug()
                      )
                      .filter(Objects::nonNull)
                      .toList();

        return new CourtResponse(
            court.getName(),
            court.getSlug(),
            court.getLocationDetails(),
            court.getImgUrl(),
            court.getPriceH(),
            court.getCapacity(),
            court.getIsIndoor(),
            court.getSurface(),
            court.getStatus(),
            court.isActive(),
            sportsAvailable
        );
    }
}
