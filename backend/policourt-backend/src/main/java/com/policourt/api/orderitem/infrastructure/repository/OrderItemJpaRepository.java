package com.policourt.api.orderitem.infrastructure.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.policourt.api.orderitem.infrastructure.entity.OrderItemEntity;

public interface OrderItemJpaRepository extends JpaRepository<OrderItemEntity, Long> {
    Optional<OrderItemEntity> findByOrderIdAndBookingId(Long orderId, Long bookingId);
}
