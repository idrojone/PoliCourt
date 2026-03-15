package com.policourt.api.payment.domain.model;

import java.math.BigDecimal;

import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.payment.domain.enums.OrderItemTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private Long id;
    private Order order;
    private Booking booking;
    private OrderItemTypeEnum itemType;
    private BigDecimal price;
}
