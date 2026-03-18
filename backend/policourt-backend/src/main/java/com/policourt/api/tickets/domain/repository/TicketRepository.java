package com.policourt.api.tickets.domain.repository;

import com.policourt.api.tickets.domain.model.Ticket;

public interface TicketRepository {
    Ticket save(Ticket ticket);

    boolean existsByOrderItemId(Long orderItemId);
}
