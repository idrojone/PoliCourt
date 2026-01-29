package com.policourt.springboot.maintenance.domain.repository;

import com.policourt.springboot.maintenance.domain.model.Maintenance;
import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Contrato del repositorio de mantenimientos en la capa de dominio.
 */
public interface MaintenanceRepository {

    Maintenance save(Maintenance maintenance);

    Optional<Maintenance> findById(UUID id);

    Optional<Maintenance> findBySlug(String slug);

    List<Maintenance> findAll();

    List<Maintenance> findByCourtId(UUID courtId);

    List<Maintenance> findByStatus(MaintenanceStatus status);

    /**
     * Busca mantenimientos que se superponen con un rango de tiempo para una pista.
     */
    List<Maintenance> findOverlappingMaintenances(
        UUID courtId,
        OffsetDateTime startTime,
        OffsetDateTime endTime
    );

    Maintenance updateStatus(UUID maintenanceId, MaintenanceStatus newStatus);

    void deleteById(UUID id);
}
