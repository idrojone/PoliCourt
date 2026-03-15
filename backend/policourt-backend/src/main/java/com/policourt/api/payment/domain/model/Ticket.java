package com.policourt.api.payment.domain.model;

import java.time.OffsetDateTime;

import com.policourt.api.payment.domain.enums.TicketStatusEnum;
import com.policourt.api.payment.domain.enums.TicketTypeEnum;
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
