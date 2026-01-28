package com.policourt.springboot.sport.presentation.request;

import com.policourt.springboot.sport.domain.model.SportStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request (DTO de entrada) para la creación de un deporte.
 * Define los datos necesarios que debe enviar el cliente.
 */
@Schema(description = "Datos requeridos para crear un nuevo deporte")
public record SportRequest(
    @Schema(description = "Nombre del deporte", example = "Fútbol Sala")
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede tener más de 100 caracteres")
    String name,

    @Schema(
        description = "Descripción detallada del deporte",
        example = "Deporte jugado en pista pequeña con 5 jugadores por equipo"
    )
    String description,

    @Schema(
        description = "URL de la imagen representativa",
        example = "https://policourt.com/images/futsal.jpg"
    )
    String imgUrl,

    @Schema(description = "Estado del deporte", example = "PUBLISHED")
    SportStatus status
) {}
