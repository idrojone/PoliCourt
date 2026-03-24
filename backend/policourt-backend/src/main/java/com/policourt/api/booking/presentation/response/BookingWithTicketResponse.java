package com.policourt.api.booking.presentation.response;

import com.policourt.api.tickets.presentation.response.TicketResponse;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Reserva con su ticket asociado")
public record BookingWithTicketResponse(
        @Schema(description = "Datos de la reserva") BookingResponse booking,
        @Schema(description = "Ticket asociado a la reserva") TicketResponse ticket) {
}
