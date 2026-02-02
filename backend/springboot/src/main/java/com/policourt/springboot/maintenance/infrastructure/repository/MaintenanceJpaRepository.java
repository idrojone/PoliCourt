package com.policourt.springboot.maintenance.infrastructure.repository;

import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import com.policourt.springboot.maintenance.infrastructure.entity.MaintenanceEntity;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceJpaRepository extends JpaRepository<MaintenanceEntity, UUID>, JpaSpecificationExecutor<MaintenanceEntity> {

    /**
     * Busca un mantenimiento por su identificador amigable (slug).
     *
     * @param slug El slug del mantenimiento.
     * @return Un Optional con la entidad encontrada.
     */
    Optional<MaintenanceEntity> findBySlug(String slug);

    /**
     * Busca todos los mantenimientos asociados a una pista.
     *
     * @param courtId El UUID de la pista.
     * @return Lista de entidades de mantenimiento.
     */
    List<MaintenanceEntity> findByCourtId(UUID courtId);

    /**
     * Busca mantenimientos filtrados por su estado.
     *
     * @param status El estado a filtrar.
     * @return Lista de entidades que coinciden con el estado.
     */
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
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime
    );

    /**
     * Busca mantenimientos que se superponen con un rango de tiempo para una pista,
     * excluyendo los cancelados y un mantenimiento específico (para updates).
     */
    @Query("""
        SELECT m FROM MaintenanceEntity m 
        WHERE m.court.id = :courtId 
        AND m.id != :excludeMaintenanceId
        AND m.status != 'CANCELLED' 
        AND m.startTime < :endTime 
        AND m.endTime > :startTime
    """)
    List<MaintenanceEntity> findOverlappingMaintenancesExcluding(
        @Param("courtId") UUID courtId,
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        @Param("excludeMaintenanceId") UUID excludeMaintenanceId
    );
}
