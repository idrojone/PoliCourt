package com.policourt.api.order.domain.repository;

import java.util.Optional;

import com.policourt.api.order.domain.model.Order;

public interface OrderRepository {
    Order save(Order order);

    Optional<Order> findById(Long id);
}
