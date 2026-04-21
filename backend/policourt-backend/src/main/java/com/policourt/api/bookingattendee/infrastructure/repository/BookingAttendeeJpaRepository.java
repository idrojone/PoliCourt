package com.policourt.api.bookingattendee.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.policourt.api.bookingattendee.infrastructure.entity.BookingAttendeeEntity;

public interface BookingAttendeeJpaRepository extends JpaRepository<BookingAttendeeEntity, Long> {
    Optional<BookingAttendeeEntity> findByBookingIdAndUserId(Long bookingId, Long userId);
    boolean existsByBookingIdAndUserId(Long bookingId, Long userId);

    @Query("SELECT a.booking FROM BookingAttendeeEntity a WHERE a.user.id = :userId AND a.booking.type = com.policourt.api.booking.domain.enums.BookingTypeEnum.CLASS AND a.booking.isActive = true")
    List<com.policourt.api.booking.infrastructure.entity.BookingEntity> findClassBookingsByUserId(@Param("userId") Long userId);
}
