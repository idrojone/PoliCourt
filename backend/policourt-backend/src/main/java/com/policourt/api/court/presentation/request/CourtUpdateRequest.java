package com.policourt.api.court.presentation.request;

import java.math.BigDecimal;
import java.util.List;

import com.policourt.api.court.domain.enums.CourtSurfaceEnum;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
@Schema(description = "Datos para actualizar una pista existente")
public class CourtUpdateRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Schema(description = "Nombre de la pista", example = "Pista Central Renovada")
    private String name;

    @Schema(description = "Detalles de ubicación", example = "Complejo Principal, Zona Norte")
    private String locationDetails;

    @Schema(description = "URL de la imagen", example = "https://example.com/court-updated.jpg")
    private String imgUrl;

    @NotNull(message = "El precio por hora es obligatorio")
    @DecimalMin(value = "0.0", message = "El precio debe ser mayor o igual a 0")
    @Schema(description = "Precio por hora", example = "30.00")
    private BigDecimal priceH;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    @Schema(description = "Capacidad de jugadores", example = "4")
    private Integer capacity;

    @NotNull(message = "Debe especificar si es interior o exterior")
    @Schema(description = "Es pista cubierta", example = "true")
    private Boolean isIndoor;

    @NotNull(message = "El tipo de superficie es obligatorio")
    @Schema(description = "Tipo de superficie", example = "GRASS")
    private CourtSurfaceEnum surface;

    @Schema(description = "Lista de slugs de deportes asociados", example = "[\"tennis\"]")
    private List<String> sportSlugs;
}
