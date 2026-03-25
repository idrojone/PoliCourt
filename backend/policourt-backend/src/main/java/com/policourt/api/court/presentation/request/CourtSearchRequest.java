package com.policourt.api.court.presentation.request;

import java.math.BigDecimal;
import java.util.List;

import com.policourt.api.court.domain.enums.CourtSurfaceEnum;
import com.policourt.api.shared.enums.GeneralStatus;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Criterios de búsqueda de pistas")
public class CourtSearchRequest {

    @Parameter(description = "Texto de búsqueda (nombre o ubicación)")
    private String q;

    @Parameter(description = "Filtrar por nombre")
    private String name;

    @Parameter(description = "Filtrar por ubicación")
    private String locationDetails;

    @Parameter(description = "Precio mínimo")
    @Min(0)
    private BigDecimal priceMin;

    @Parameter(description = "Precio máximo")
    @Min(0)
    private BigDecimal priceMax;

    @Parameter(description = "Capacidad mínima")
    @Min(1)
    private Integer capacityMin;

    @Parameter(description = "Capacidad máxima")
    @Min(1)
    private Integer capacityMax;

    @Parameter(description = "Filtrar por interior/exterior")
    private Boolean isIndoor;

    @Parameter(description = "Filtrar por superficie")
    private List<CourtSurfaceEnum> surfaces;

    @Parameter(description = "Filtrar por estados")
    private List<GeneralStatus> statuses;

    @Parameter(description = "Filtrar por deportes (slugs)")
    private List<String> sports;

    @Parameter(description = "Filtrar por activo/inactivo")
    private Boolean isActive;

    @Parameter(description = "Número de página (1-indexed)")
    @Min(1)
    @Builder.Default
    private int page = 1;

    @Parameter(description = "Cantidad de elementos por página")
    @Min(1)
    @Builder.Default
    private int limit = 8;

    @Parameter(description = "Ordenamiento (ej: name_asc, price_desc)")
    @Builder.Default
    private String sort = "name_asc";
}
