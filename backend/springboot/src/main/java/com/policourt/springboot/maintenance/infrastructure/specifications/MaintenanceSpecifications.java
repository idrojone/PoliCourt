package com.policourt.springboot.maintenance.infrastructure.specifications;

import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import com.policourt.springboot.maintenance.infrastructure.entity.MaintenanceEntity;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Clase que contiene las especificaciones para consultas JPA de mantenimientos.
 */
public class MaintenanceSpecifications {

    /**
     * Especificación para buscar por slug.
     */
    public static Specification<MaintenanceEntity> hasSlug(String slug) {
        return (root, query, cb) -> cb.equal(root.get("slug"), slug);
    }

    /**
     * Especificación para buscar por ID de pista.
     */
    public static Specification<MaintenanceEntity> hasCourtId(UUID courtId) {
        return (root, query, cb) -> cb.equal(root.get("court").get("id"), courtId);
    }

    /**
     * Especificación para buscar por estado.
     */
    public static Specification<MaintenanceEntity> hasStatus(MaintenanceStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    /**
     * Especificación para excluir mantenimientos cancelados.
     */
    public static Specification<MaintenanceEntity> notCancelled() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), MaintenanceStatus.CANCELLED);
    }

    /**
     * Especificación para mantenimientos que se superponen en tiempo.
     */
    public static Specification<MaintenanceEntity> overlapping(LocalDateTime startTime, LocalDateTime endTime) {
        return (root, query, cb) -> cb.and(
            cb.lessThan(root.get("startTime"), endTime),
            cb.greaterThan(root.get("endTime"), startTime)
        );
    }

    /**
     * Especificación para mantenimientos que se superponen, incluyendo filtros de pista y no cancelados.
     */
    public static Specification<MaintenanceEntity> overlappingMaintenances(UUID courtId, LocalDateTime startTime, LocalDateTime endTime) {
        return hasCourtId(courtId).and(notCancelled()).and(overlapping(startTime, endTime));
    }

    /**
     * Especificación para excluir un mantenimiento específico por ID.
     */
    public static Specification<MaintenanceEntity> notId(UUID id) {
        return (root, query, cb) -> cb.notEqual(root.get("id"), id);
    }

    /**
     * Especificación para mantenimientos que se superponen, excluyendo uno específico.
     */
    public static Specification<MaintenanceEntity> overlappingMaintenancesExcluding(UUID courtId, LocalDateTime startTime, LocalDateTime endTime, UUID excludeId) {
        return hasCourtId(courtId).and(notCancelled()).and(overlapping(startTime, endTime)).and(notId(excludeId));
    }
}