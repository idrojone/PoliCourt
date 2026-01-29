package com.policourt.springboot.maintenance.presentation.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Response con información sobre las reservas canceladas por un mantenimiento.
 */
@Schema(description = "Resultado de la programación de un mantenimiento")
public record MaintenanceCreatedResponse(
    @Schema(description = "Datos del mantenimiento creado")
    MaintenanceResponse maintenance,

    @Schema(description = "Cantidad de reservas canceladas automáticamente")
    int cancelledBookingsCount,

    @Schema(description = "Mensaje informativo")
    String message
) {}
