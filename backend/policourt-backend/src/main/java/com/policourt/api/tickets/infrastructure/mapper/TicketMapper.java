package com.policourt.api.tickets.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.orderitem.domain.model.OrderItem;
import com.policourt.api.tickets.domain.model.Ticket;
import com.policourt.api.tickets.infrastructure.entity.TicketEntity;
import com.policourt.api.user.domain.model.User;

@Component
public class TicketMapper {

    public Ticket toDomain(TicketEntity entity) {
        if (entity == null) {
            return null;
        }

        return Ticket.builder()
                .id(entity.getId())
                .user(User.builder().id(entity.getUser().getId()).build())
                .orderItem(OrderItem.builder().id(entity.getOrderItem().getId()).build())
                .code(entity.getCode())
                .type(entity.getType())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public TicketEntity toEntity(Ticket ticket) {
        if (ticket == null) {
            return null;
        }

        return TicketEntity.builder()
                .id(ticket.getId())
                .code(ticket.getCode())
                .type(ticket.getType())
                .status(ticket.getStatus())
                .build();
    }

    public void updateEntity(TicketEntity entity, Ticket ticket) {
        entity.setCode(ticket.getCode());
        entity.setType(ticket.getType());
        entity.setStatus(ticket.getStatus());
    }
}
