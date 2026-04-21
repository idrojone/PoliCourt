package com.policourt.api.payment.presentation.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Solicitud para crear un PaymentIntent de inscripción a clase")
public class ClassEnrollmentPaymentIntentCreateRequest {

    @Schema(description = "UUID de la clase a la que se quiere inscribir")
    @NotBlank(message = "bookingUuid es obligatorio")
    private String bookingUuid;
}
