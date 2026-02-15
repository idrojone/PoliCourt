package com.policourt.api.club.presentation.request;

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
@Schema(description = "Datos para actualizar el estado de un club")
public class ClubStatusUpdateRequest {

    @NotNull(message = "El estado es obligatorio")
    @Schema(description = "Nuevo estado del club", example = "ARCHIVED")
    private GeneralStatus status;
}
