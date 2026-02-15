package com.policourt.api.club.presentation.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Datos para actualizar un club")
public class ClubUpdateRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Schema(description = "Nombre del club", example = "Club de Tenis Madrid (Actualizado)")
    private String name;

    @Schema(description = "Descripción del club", example = "Descripción actualizada.")
    private String description;

    @Schema(description = "URL de la imagen", example = "https://example.com/club-updated.jpg")
    private String imgUrl;

    @Schema(description = "Slug del deporte asociado", example = "padel")
    private String sportSlug;
}
