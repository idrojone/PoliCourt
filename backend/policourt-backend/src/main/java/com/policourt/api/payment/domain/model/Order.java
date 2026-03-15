package com.policourt.api.payment.domain.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.policourt.api.payment.domain.enums.OrderStatusEnum;
import com.policourt.api.user.domain.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long id;
    private User user;
    private BigDecimal totalAmount;
    private String currency;
    private OrderStatusEnum status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
