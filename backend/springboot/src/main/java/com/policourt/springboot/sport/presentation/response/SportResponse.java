package com.policourt.springboot.sport.presentation.response;

import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.model.SportStatus;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Response (DTO de salida) para deportes.
 * Filtra los datos de dominio para exponer solo lo necesario al cliente.
 */
@Schema(description = "Datos públicos del deporte")
public record SportResponse(
    @Schema(description = "Nombre del deporte", example = "Fútbol")
    String name,
    
    @Schema(description = "Slug único para URLs", example = "futbol")
    String slug,
    
    String description,
    String imgUrl,
    SportStatus status,
    boolean isActive
) {
    public static SportResponse fromDomain(Sport sport) {
        return new SportResponse(sport.getName(), sport.getSlug(), sport.getDescription(), sport.getImgUrl(), sport.getStatus(), sport.isActive());
    }
}