package com.policourt.api.shared.response;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Estructura estándar de respuesta paginada")
public class PaginatedResponse<T> {

    @Schema(description = "Lista de elementos de la página actual")
    private List<T> content;

    @Schema(description = "Número de página actual (1-indexed)", example = "1")
    private int page;

    @Schema(description = "Cantidad de elementos por página", example = "10")
    private int limit;

    @Schema(description = "Total de elementos encontrados", example = "42")
    private long totalElements;

    @Schema(description = "Total de páginas disponibles", example = "5")
    private int totalPages;

    @Schema(description = "Indica si es la primera página", example = "true")
    private boolean first;

    @Schema(description = "Indica si es la última página", example = "false")
    private boolean last;
}
