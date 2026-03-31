package com.policourt.api.orderitem.domain.repository;

import java.util.Optional;

import com.policourt.api.orderitem.domain.model.OrderItem;

public interface OrderItemRepository {
    OrderItem save(OrderItem orderItem);

    Optional<OrderItem> findByOrderIdAndBookingId(Long orderId, Long bookingId);

    Optional<OrderItem> findByBookingId(Long bookingId);
}
