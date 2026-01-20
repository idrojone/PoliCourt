package com.policourt.springboot.sport.presentation.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


/**
 * Request (DTO de entrada) para la creación de un deporte.
 * Define los datos necesarios que debe enviar el cliente.
 */
@Schema(description = "Datos requeridos para crear un nuevo deporte")
public record SportCreateRequest(
        @Schema(description = "Nombre del deporte", example = "Fútbol Sala") @NotBlank(message = "El nombre es obligatorio, che") @Size(max = 100, message = "El nombre no puede tener más de 100 caracteres") String name,

        @Schema(description = "Identificador URL-friendly (opcional). Si se omite, se genera desde el nombre", example = "futbol-sala") @Size(max = 100, message = "El slug no puede tener más de 100 caracteres") String slug,

        @Schema(description = "Descripción detallada del deporte", example = "Deporte jugado en cancha pequeña con 5 jugadores por equipo") String description,

        @Schema(description = "URL de la imagen representativa", example = "https://policourt.com/images/futsal.jpg") String imgUrl) {
}