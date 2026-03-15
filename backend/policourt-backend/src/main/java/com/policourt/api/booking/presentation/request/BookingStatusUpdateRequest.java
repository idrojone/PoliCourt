package com.policourt.api.booking.presentation.request;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
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
@Schema(description = "Solicitud para actualizar el estado de una reserva")
public class BookingStatusUpdateRequest {

    @Schema(description = "Nuevo estado de la reserva", example = "CONFIRMED")
    @NotNull(message = "El estado es obligatorio")
    private BookingStatusEnum status;
}
