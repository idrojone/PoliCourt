package com.policourt.api.tickets.presentation.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.tickets.domain.model.Ticket;
import com.policourt.api.tickets.presentation.response.TicketResponse;

@Component
public class TicketPresentationMapper {

    public TicketResponse toResponse(Ticket ticket) {
        if (ticket == null) {
            return null;
        }

        return new TicketResponse(
                ticket.getCode(),
                ticket.getType(),
                ticket.getStatus(),
                ticket.getCreatedAt());
    }
}
