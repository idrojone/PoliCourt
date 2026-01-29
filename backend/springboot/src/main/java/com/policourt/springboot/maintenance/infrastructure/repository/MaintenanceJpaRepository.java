package com.policourt.springboot.maintenance.infrastructure.repository;

import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import com.policourt.springboot.maintenance.infrastructure.entity.MaintenanceEntity;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceJpaRepository extends JpaRepository<MaintenanceEntity, UUID> {

    Optional<MaintenanceEntity> findBySlug(String slug);

    List<MaintenanceEntity> findByCourtId(UUID courtId);

    List<MaintenanceEntity> findByStatus(MaintenanceStatus status);

    /**
     * Busca mantenimientos que se superponen con un rango de tiempo para una pista,
     * excluyendo los cancelados.
     * Lógica de superposición: (start1 < end2) AND (end1 > start2)
     */
    @Query("""
        SELECT m FROM MaintenanceEntity m 
        WHERE m.court.id = :courtId 
        AND m.status != 'CANCELLED' 
        AND m.startTime < :endTime 
        AND m.endTime > :startTime
    """)
    List<MaintenanceEntity> findOverlappingMaintenances(
        @Param("courtId") UUID courtId,
        @Param("startTime") OffsetDateTime startTime,
        @Param("endTime") OffsetDateTime endTime
    );
}
