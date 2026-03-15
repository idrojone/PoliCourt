package com.policourt.api.payment.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.policourt.api.payment.infrastructure.entity.OrderEntity;

public interface OrderJpaRepository extends JpaRepository<OrderEntity, Long> {
}
