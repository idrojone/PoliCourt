package com.policourt.api.tickets.infrastructure.adapter;

import org.springframework.stereotype.Repository;

import com.policourt.api.orderitem.infrastructure.repository.OrderItemJpaRepository;
import com.policourt.api.tickets.domain.model.Ticket;
import com.policourt.api.tickets.domain.repository.TicketRepository;
import com.policourt.api.tickets.infrastructure.entity.TicketEntity;
import com.policourt.api.tickets.infrastructure.mapper.TicketMapper;
import com.policourt.api.tickets.infrastructure.repository.TicketJpaRepository;
import com.policourt.api.user.infrastructure.repository.UserJpaRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class TicketRepositoryAdapter implements TicketRepository {

    private final TicketJpaRepository ticketJpaRepository;
    private final OrderItemJpaRepository orderItemJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final TicketMapper ticketMapper;

    @Override
    public Ticket save(Ticket ticket) {
        TicketEntity entity;

        if (ticket.getId() != null) {
            entity = ticketJpaRepository.findById(ticket.getId())
                    .orElseGet(() -> ticketMapper.toEntity(ticket));
            ticketMapper.updateEntity(entity, ticket);
        } else {
            entity = ticketMapper.toEntity(ticket);
        }

        if (ticket.getUser() != null && ticket.getUser().getId() != null) {
            var user = userJpaRepository.findById(ticket.getUser().getId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + ticket.getUser().getId()));
            entity.setUser(user);
        }

        if (ticket.getOrderItem() != null && ticket.getOrderItem().getId() != null) {
            var orderItem = orderItemJpaRepository.findById(ticket.getOrderItem().getId())
                    .orElseThrow(() -> new RuntimeException("Order item not found with id: " + ticket.getOrderItem().getId()));
            entity.setOrderItem(orderItem);
        }

        return ticketMapper.toDomain(ticketJpaRepository.save(entity));
    }

    @Override
    public boolean existsByOrderItemId(Long orderItemId) {
        return ticketJpaRepository.existsByOrderItemId(orderItemId);
    }
}
