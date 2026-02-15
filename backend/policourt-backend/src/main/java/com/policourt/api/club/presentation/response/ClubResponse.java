package com.policourt.api.club.presentation.response;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.presentation.response.SportResponse;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos públicos del club")
public record ClubResponse(
        @Schema(description = "Nombre del club", example = "Club de Tenis") String name,
        @Schema(description = "Slug único", example = "club-de-tenis") String slug,
        @Schema(description = "Descripción", example = "El mejor club de la ciudad") String description,
        @Schema(description = "URL de la imagen", example = "https://example.com/club.jpg") String imgUrl,
        @Schema(description = "Deporte asociado") SportResponse sport,
        @Schema(description = "Estado actual", example = "PUBLISHED") GeneralStatus status,
        @Schema(description = "Si está activo", example = "true") Boolean isActive) {
}
