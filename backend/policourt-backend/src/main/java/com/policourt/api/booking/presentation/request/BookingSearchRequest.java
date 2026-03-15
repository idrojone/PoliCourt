package com.policourt.api.booking.presentation.request;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
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
@Schema(description = "Criterios de búsqueda de reservas")
public class BookingSearchRequest {

    @Parameter(description = "Texto de búsqueda (título, descripción)")
    private String q;

    @Parameter(description = "Filtrar por slug de deporte")
    private String sportSlug;

    @Parameter(description = "Filtrar por slug de pista")
    private String courtSlug;

    @Parameter(description = "Filtrar por username del organizador")
    private String organizerUsername;

    @Parameter(description = "Filtrar por estado")
    private BookingStatusEnum status;

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

    @Parameter(description = "Ordenamiento (ej: startTime_asc, startTime_desc)")
    @Builder.Default
    private String sort = "startTime_asc";
}
