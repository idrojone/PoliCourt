package com.policourt.api.booking.infrastructure.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.policourt.api.booking.infrastructure.entity.BookingEntity;

public interface BookingJpaRepository extends JpaRepository<BookingEntity, Long>, JpaSpecificationExecutor<BookingEntity> {
    Optional<BookingEntity> findByUuid(UUID uuid);

    Optional<BookingEntity> findByTitle(String title);
}
