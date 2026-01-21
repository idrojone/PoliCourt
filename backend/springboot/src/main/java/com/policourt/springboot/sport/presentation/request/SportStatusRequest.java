package com.policourt.springboot.sport.presentation.request;

import com.policourt.springboot.sport.domain.model.SportStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Datos para actualizar el estado de un deporte")
public record SportStatusRequest(
        @Schema(description = "Nuevo estado (ACTIVE, INACTIVE, etc)", example = "ARCHIVED") 
        @NotNull(message = "El estado es obligatorio") 
        SportStatus status) {
}