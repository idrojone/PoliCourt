package com.policourt.api.tickets.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.policourt.api.tickets.infrastructure.entity.TicketEntity;

public interface TicketJpaRepository extends JpaRepository<TicketEntity, Long> {
    boolean existsByOrderItemId(Long orderItemId);
}
