package com.policourt.api.payment.domain.repository;

import java.util.Optional;

import com.policourt.api.payment.domain.model.OrderItem;

public interface OrderItemRepository {
    OrderItem save(OrderItem orderItem);

    Optional<OrderItem> findByOrderIdAndBookingId(Long orderId, Long bookingId);
}
