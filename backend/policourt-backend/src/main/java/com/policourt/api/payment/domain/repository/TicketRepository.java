package com.policourt.api.payment.domain.repository;

import com.policourt.api.payment.domain.model.Ticket;

public interface TicketRepository {
    Ticket save(Ticket ticket);

    boolean existsByOrderItemId(Long orderItemId);
}
