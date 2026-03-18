package com.policourt.api.tickets.domain.model;

import java.time.OffsetDateTime;

import com.policourt.api.orderitem.domain.model.OrderItem;
import com.policourt.api.tickets.domain.enums.TicketStatusEnum;
import com.policourt.api.tickets.domain.enums.TicketTypeEnum;
import com.policourt.api.user.domain.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    private Long id;
    private User user;
    private OrderItem orderItem;
    private String code;
    private TicketTypeEnum type;
    private TicketStatusEnum status;
    private OffsetDateTime createdAt;
}
