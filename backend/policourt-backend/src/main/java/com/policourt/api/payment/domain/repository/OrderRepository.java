package com.policourt.api.payment.domain.repository;

import java.util.Optional;

import com.policourt.api.payment.domain.model.Order;

public interface OrderRepository {
    Order save(Order order);

    Optional<Order> findById(Long id);
}
