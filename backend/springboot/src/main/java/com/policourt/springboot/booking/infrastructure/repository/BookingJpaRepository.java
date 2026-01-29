package com.policourt.springboot.booking.infrastructure.repository;

import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.infrastructure.entity.BookingEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingJpaRepository
    extends JpaRepository<BookingEntity, UUID>
{
    /**
     * Encuentra reservas que se superponen con un rango de tiempo para una cancha específica,
     * excluyendo las canceladas.
     * Esto es útil para una validación rápida en la capa de servicio antes de invocar
     * la lógica de restricción de superposición de la base de datos.
     * La lógica es: (start1 < end2) AND (end1 > start2).
     */
    @Query(
        "SELECT b FROM BookingEntity b WHERE b.court.id = :courtId AND b.status != 'CANCELLED' AND b.startTime < :endTime AND b.endTime > :startTime"
    )
    List<BookingEntity> findOverlappingBookings(
        @Param("courtId") UUID courtId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    List<BookingEntity> findByOrganizerId(UUID organizerId);

    Optional<BookingEntity> findBySlug(String slug);

    /**
     * Busca todas las reservas de un tipo específico.
     */
    List<BookingEntity> findByType(BookingType type);

    /**
     * Cancela todas las reservas activas (CONFIRMED o PENDING) en un rango de tiempo.
     * Se usa cuando se programa un mantenimiento de pista.
     */
    @Modifying
    @Query("""
        UPDATE BookingEntity b 
        SET b.status = :newStatus, b.updatedAt = CURRENT_TIMESTAMP 
        WHERE b.court.id = :courtId 
        AND b.status IN ('CONFIRMED', 'PENDING') 
        AND b.startTime < :endTime 
        AND b.endTime > :startTime
    """)
    int cancelBookingsInRange(
        @Param("courtId") UUID courtId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        @Param("newStatus") BookingStatus newStatus
    );
}
