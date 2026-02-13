package com.policourt.api.sport.presentation.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos públicos del deporte")
public record SportResponse(
        @Schema(description = "Nombre del deporte", example = "Fútbol") String name,

        @Schema(description = "Slug único para URLs", example = "futbol") String slug,
        @Schema(description = "Descripción detallada del deporte", example = "Deporte jugado en pista pequeña con 5 jugadores por equipo") String description,
        @Schema(description = "URL de la imagen representativa", example = "https://policourt.com/images/futsal.jpg") String imgUrl) {
}