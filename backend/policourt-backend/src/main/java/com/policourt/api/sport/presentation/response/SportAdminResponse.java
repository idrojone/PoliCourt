package com.policourt.api.sport.presentation.response;

import com.policourt.api.shared.enums.GeneralStatus;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos públicos del deporte")
public record SportAdminResponse(
                @Schema(description = "Nombre del deporte", example = "Fútbol") String name,

                @Schema(description = "Slug único para URLs", example = "futbol") String slug,

                String description,
                String imgUrl,
                GeneralStatus status,
                boolean isActive) {
}
