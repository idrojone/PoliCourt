package com.policourt.api.club.presentation.request;

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
@Schema(description = "Datos para crear un nuevo club")
public class ClubCreateRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Schema(description = "Nombre del club", example = "Club de Tenis Madrid")
    private String name;

    @Schema(description = "Descripción del club", example = "El mejor club de tenis de la zona norte.")
    private String description;

    @Schema(description = "URL de la imagen", example = "https://example.com/club.jpg")
    private String imgUrl;

    @NotNull(message = "El deporte asociado es obligatorio")
    @Schema(description = "Slug del deporte asociado", example = "tennis")
    private String sportSlug;
}
