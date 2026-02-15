package com.policourt.api.court.presentation.request;

import com.policourt.api.shared.enums.GeneralStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Solicitud de cambio de estado de la pista")
public class CourtStatusUpdateRequest {

    @Schema(description = "Nuevo estado de la pista", example = "PUBLISHED")
    @NotNull(message = "El estado es obligatorio")
    private GeneralStatus status;
}
