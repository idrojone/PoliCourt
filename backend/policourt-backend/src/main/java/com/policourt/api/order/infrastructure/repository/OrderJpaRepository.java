package com.policourt.api.order.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.policourt.api.order.infrastructure.entity.OrderEntity;

public interface OrderJpaRepository extends JpaRepository<OrderEntity, Long> {
}
