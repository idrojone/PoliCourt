package com.policourt.api.payment.presentation.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta de creación de PaymentIntent")
public record PaymentIntentCreateResponse(
        @Schema(description = "Client secret de Stripe") String clientSecret,
        @Schema(description = "Id de la orden") Long orderId,
        @Schema(description = "UUID de la reserva") String bookingUuid) {
}
