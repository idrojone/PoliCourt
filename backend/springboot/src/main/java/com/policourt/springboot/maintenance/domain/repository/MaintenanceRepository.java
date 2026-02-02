package com.policourt.springboot.maintenance.domain.repository;

import com.policourt.springboot.maintenance.domain.model.Maintenance;
import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Contrato del repositorio de mantenimientos en la capa de dominio.
 */
public interface MaintenanceRepository {

    /**
     * Guarda un nuevo mantenimiento en el sistema.
     *
     * @param maintenance El objeto de dominio a persistir.
     * @return El mantenimiento guardado con su ID y metadatos generados.
     */
    Maintenance save(Maintenance maintenance);

    /**
     * Busca un mantenimiento por su identificador único (UUID).
     *
     * @param id El UUID del mantenimiento.
     * @return Un Optional que contiene el mantenimiento si se encuentra.
     */
    Optional<Maintenance> findById(UUID id);

    /**
     * Busca un mantenimiento por su identificador amigable (slug).
     *
     * @param slug El slug del mantenimiento.
     * @return Un Optional que contiene el mantenimiento si se encuentra.
     */
    Optional<Maintenance> findBySlug(String slug);

    /**
     * Recupera todos los mantenimientos registrados en el sistema.
     *
     * @return Una lista con todos los mantenimientos.
     */
    List<Maintenance> findAll();

    /**
     * Busca todos los mantenimientos asociados a una pista específica.
     *
     * @param courtId El UUID de la pista.
     * @return Una lista de mantenimientos para dicha pista.
     */
    List<Maintenance> findByCourtId(UUID courtId);

    /**
     * Busca mantenimientos filtrados por su estado actual.
     *
     * @param status El estado por el cual filtrar (SCHEDULED, IN_PROGRESS, etc.).
     * @return Una lista de mantenimientos que coinciden con el estado.
     */
    List<Maintenance> findByStatus(MaintenanceStatus status);

    /**
     * Busca mantenimientos que se superponen con un rango de tiempo para una pista.
     *
     * @param courtId   El UUID de la pista.
     * @param startTime Fecha y hora de inicio del rango.
     * @param endTime   Fecha y hora de fin del rango.
     * @return Lista de mantenimientos que colisionan con el rango proporcionado.
     */
    List<Maintenance> findOverlappingMaintenances(
        UUID courtId,
        LocalDateTime startTime,
        LocalDateTime endTime
    );

    /**
     * Busca mantenimientos que se superponen con un rango de tiempo, excluyendo uno específico.
     * Útil para validar actualizaciones de horario sin contar el mantenimiento actual.
     *
     * @param courtId              El UUID de la pista.
     * @param startTime            Nueva fecha de inicio.
     * @param endTime              Nueva fecha de fin.
     * @param excludeMaintenanceId ID del mantenimiento que se está editando para ignorarlo en la búsqueda.
     * @return Lista de otros mantenimientos que colisionan con el nuevo rango.
     */
    List<Maintenance> findOverlappingMaintenancesExcluding(
        UUID courtId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        UUID excludeMaintenanceId
    );

    /**
     * Actualiza únicamente el estado de un mantenimiento.
     *
     * @param maintenanceId El UUID del mantenimiento a actualizar.
     * @param newStatus     El nuevo estado a asignar.
     * @return El mantenimiento actualizado.
     */
    Maintenance updateStatus(UUID maintenanceId, MaintenanceStatus newStatus);

    /**
     * Actualiza un mantenimiento completo.
     *
     * @param maintenance El objeto de dominio con los datos actualizados.
     * @return El mantenimiento tras persistir los cambios.
     */
    Maintenance update(Maintenance maintenance);

    /**
     * Elimina un mantenimiento del sistema por su ID.
     *
     * @param id El UUID del mantenimiento a eliminar.
     */
    void deleteById(UUID id);
}
