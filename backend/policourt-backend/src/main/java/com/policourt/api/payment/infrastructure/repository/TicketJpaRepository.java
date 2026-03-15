package com.policourt.api.payment.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.policourt.api.payment.infrastructure.entity.TicketEntity;

public interface TicketJpaRepository extends JpaRepository<TicketEntity, Long> {
    boolean existsByOrderItemId(Long orderItemId);
}
