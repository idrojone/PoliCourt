package com.policourt.springboot.sport.presentation.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record SportSummaryResponse(
    @Schema(description = "Slug único para URLs", example = "tenis")
    String slug,
    @Schema(description = "Nombre del deporte", example = "Tenis") String name,
    @Schema(
        description = "URL de la imagen del deporte",
        example = "https://example.com/sport.jpg"
    )
    String imgUrl
) {}
