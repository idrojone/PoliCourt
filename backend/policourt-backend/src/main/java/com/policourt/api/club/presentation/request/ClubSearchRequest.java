package com.policourt.api.club.presentation.request;

import java.util.List;

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
@Schema(description = "Criterios de búsqueda de clubes")
public class ClubSearchRequest {

    @Parameter(description = "Filtrar por nombre")
    private String name;

    @Parameter(description = "Filtrar por estados")
    private GeneralStatus status;

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
    private int limit = 10;

    @Parameter(description = "Ordenamiento (ej: name_asc, id_desc)")
    @Builder.Default
    private String sort = "name_asc";
}
