package com.policourt.api.booking.infrastructure.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.policourt.api.booking.infrastructure.entity.BookingEntity;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;

public interface BookingJpaRepository extends JpaRepository<BookingEntity, Long>, JpaSpecificationExecutor<BookingEntity> {
    Optional<BookingEntity> findByUuid(UUID uuid);

    Optional<BookingEntity> findByTitle(String title);

        @Query(value = "SELECT 1 FROM bookings WHERE court_id = :courtId AND start_time = :startTime AND end_time = :endTime FOR UPDATE NOWAIT", nativeQuery = true)
        Integer lockSlotNowait(@Param("courtId") Long courtId, @Param("startTime") OffsetDateTime startTime,
            @Param("endTime") OffsetDateTime endTime);

        @Modifying
        @Query(value = "UPDATE bookings SET status = 'CANCELLED', is_active = false, updated_at = NOW() WHERE status = 'PENDING' AND created_at < :cutoff", nativeQuery = true)
        int cancelOldPendingBookings(@Param("cutoff") OffsetDateTime cutoff);

        @Query(value = "SELECT 1 FROM bookings WHERE court_id = :courtId AND start_time = :startTime AND end_time = :endTime AND status IN ('CONFIRMED','SUCCESS','COMPLETED') AND is_active = true LIMIT 1", nativeQuery = true)
        Integer existsActiveBookingForCourtAndTime(@Param("courtId") Long courtId, @Param("startTime") OffsetDateTime startTime,
            @Param("endTime") OffsetDateTime endTime);

        @Query("SELECT b FROM BookingEntity b WHERE b.court.id = :courtId AND b.isActive = TRUE "
                + "AND b.status IN ('PENDING','CONFIRMED','SUCCESS') "
                        + "AND b.startTime < :endTime AND b.endTime > :startTime "
                        + "AND b.type IN :types")
        List<BookingEntity> findActiveOverlapping(@Param("courtId") Long courtId,
                        @Param("startTime") OffsetDateTime startTime,
                        @Param("endTime") OffsetDateTime endTime,
                        @Param("types") List<BookingTypeEnum> types);
}
