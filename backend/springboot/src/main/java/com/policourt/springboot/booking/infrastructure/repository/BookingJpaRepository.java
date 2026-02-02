package com.policourt.springboot.booking.infrastructure.repository;

import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.infrastructure.entity.BookingEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingJpaRepository
    extends JpaRepository<BookingEntity, UUID>, JpaSpecificationExecutor<BookingEntity>
{
    /**
     * Busca todas las reservas organizadas por un usuario específico.
     */
    List<BookingEntity> findByOrganizerId(UUID organizerId);

    /**
     * Busca una reserva por su slug único.
     */
    Optional<BookingEntity> findBySlug(String slug);

    /**
     * Busca todas las reservas de un tipo específico.
     */
    List<BookingEntity> findByType(BookingType type);

    /**
     * Cancela todas las reservas activas (CONFIRMED o PENDING) en un rango de tiempo.
     * Se usa cuando se programa un mantenimiento de pista.
     *
     * @param courtId ID de la pista.
     * @param startTime Fecha y hora de inicio del rango.
     * @param endTime Fecha y hora de fin del rango.
     * @param newStatus El nuevo estado a asignar (generalmente CANCELLED).
     * @return El número de reservas actualizadas.
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
