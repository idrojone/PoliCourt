package com.policourt.api.tickets.application;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.policourt.api.tickets.domain.model.Ticket;
import com.policourt.api.tickets.domain.repository.TicketRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public Optional<Ticket> getTicketByBookingId(Long bookingId) {
        return ticketRepository.findByBookingId(bookingId);
    }
}
