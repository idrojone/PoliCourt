package com.policourt.springboot.maintenance.application.service;

import com.policourt.springboot.auth.domain.repository.UserRepository;
import com.policourt.springboot.booking.domain.repository.BookingRepository;
import com.policourt.springboot.court.domain.repository.CourtRepository;
import com.policourt.springboot.maintenance.domain.model.Maintenance;
import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import com.policourt.springboot.maintenance.application.mapper.MaintenanceDtoMapper;
import com.policourt.springboot.maintenance.domain.repository.MaintenanceRepository;
import com.policourt.springboot.maintenance.presentation.request.CreateMaintenanceRequest;
import com.policourt.springboot.maintenance.presentation.request.UpdateMaintenanceRequest;
import com.policourt.springboot.shared.application.exception.ResourceNotFoundException;
import com.policourt.springboot.shared.utils.DateTimeUtils;
import com.policourt.springboot.shared.utils.SlugGenerator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final SlugGenerator slugGenerator;
    private final MaintenanceDtoMapper maintenanceDtoMapper;

    /**
     * Resultado de la creación de un mantenimiento, incluye cantidad de reservas canceladas.
     * Este record es necesario para devolver ambos valores desde el método createMaintenance.
     * Si no se usara, solo se podría devolver el Maintenance y el usuario final no sabría cuántas reservas se cancelaron.
     */
    public record MaintenanceCreationResult(Maintenance maintenance, int cancelledBookingsCount) {}

    /**
     * Programa un nuevo mantenimiento para una pista específica.
     * Valida que las fechas sean correctas, que no existan solapamientos con otros mantenimientos
     * y cancela automáticamente cualquier reserva existente en ese rango horario.
     *
     * @param request DTO con la información necesaria para crear el mantenimiento.
     * @return Un {@link MaintenanceCreationResult} que contiene el mantenimiento creado y el número de reservas canceladas.
     * @throws IllegalArgumentException si las fechas son inválidas o hay solapamiento de mantenimientos.
     * @throws ResourceNotFoundException si la pista o el usuario creador no existen.
     */
    @Transactional
    public MaintenanceCreationResult createMaintenance(CreateMaintenanceRequest request) {
        // 1. Validar fechas
        // La fecha de inicio no puede estar en el pasado, utilizamos DateTimeUtils para consistencia de zona horaria
        if (DateTimeUtils.isPast(request.startTime())) {
            throw new IllegalArgumentException(
                "La fecha de inicio no puede estar en el pasado."
            );
        }

        // La fecha de fin debe ser posterior a la de inicio
        // Aquí no es necesario usar DateTimeUtils porque ambas fechas vienen del mismo origen
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException(
                "La fecha de fin debe ser posterior a la fecha de inicio."
            );
        }

        // 2. Buscar la pista
        var court = courtRepository
            .findBySlug(request.courtSlug())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Pista con slug: " + request.courtSlug() + " no encontrada."
            ));

        // 3. Buscar el usuario creador
        var createdBy = userRepository
            .findByUsername(request.createdByUsername())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Usuario con username: " + request.createdByUsername() + " no encontrado."
            ));

        // 4. Verificar que no haya otro mantenimiento superpuesto
        var overlappingMaintenances = maintenanceRepository.findOverlappingMaintenances(
            court.getId(),
            request.startTime(),
            request.endTime()
        );

        if (!overlappingMaintenances.isEmpty()) {
            throw new IllegalArgumentException(
                "Ya existe un mantenimiento programado para la pista en ese rango de tiempo."
            );
        }

        // 5. Cancelar las reservas que se superponen con el mantenimiento
        int cancelledCount = bookingRepository.cancelBookingsInRange(
            court.getId(),
            request.startTime(),
            request.endTime()
        );

        if (cancelledCount > 0) {
            log.info("Se cancelaron {} reservas debido al mantenimiento programado en pista {}.",
                cancelledCount, court.getName());
        }

        // 6. Crear el mantenimiento
        var maintenance = maintenanceDtoMapper.toDomain(request, court, createdBy);

        // 7. Generar slug
        String titleForSlug = maintenance.getTitle() != null && !maintenance.getTitle().isBlank()
            ? maintenance.getTitle()
            : "mantenimiento";
        maintenance.setSlug(slugGenerator.generate(titleForSlug));

        // 8. Guardar
        var savedMaintenance = maintenanceRepository.save(maintenance);

        return new MaintenanceCreationResult(savedMaintenance, cancelledCount);
    }

    /**
     * Busca un mantenimiento por su slug único.
     *
     * @param slug El identificador amigable del mantenimiento.
     * @return El objeto de dominio {@link Maintenance} encontrado.
     * @throws ResourceNotFoundException si no existe un mantenimiento con el slug proporcionado.
     */
    @Transactional(readOnly = true)
    public Maintenance findBySlug(String slug) {
        return maintenanceRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Mantenimiento con slug: " + slug + " no encontrado."
            ));
    }

    /**
     * Obtiene la lista completa de todos los mantenimientos registrados.
     *
     * @return Una lista de objetos de dominio {@link Maintenance}.
     */
    @Transactional(readOnly = true)
    public List<Maintenance> findAll() {
        return maintenanceRepository.findAll();
    }

    /**
     * Obtiene la lista de mantenimientos asociados a una pista específica.
     *
     * @param courtSlug El slug de la pista.
     * @return Una lista de objetos de dominio {@link Maintenance} para esa pista.
     * @throws ResourceNotFoundException si la pista no existe.
     */
    @Transactional(readOnly = true)
    public List<Maintenance> findByCourtSlug(String courtSlug) {
        var court = courtRepository.findBySlug(courtSlug)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Pista con slug: " + courtSlug + " no encontrada."
            ));
        return maintenanceRepository.findByCourtId(court.getId());
    }

    /**
     * Obtiene una lista de mantenimientos filtrados por su estado actual.
     *
     * @param status El estado por el cual filtrar
     * @return Una lista de objetos de dominio {@link Maintenance} que coinciden con el estado.
     */
    @Transactional(readOnly = true)
    public List<Maintenance> findByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status);
    }

    /**
     * Actualiza el estado de un mantenimiento existente validando la transición.
     *
     * @param slug El identificador único del mantenimiento.
     * @param newStatus El nuevo estado al que se desea cambiar.
     * @return El objeto de dominio {@link Maintenance} con el estado actualizado.
     * @throws IllegalArgumentException si la transición de estado no es permitida.
     */
    @Transactional
    public Maintenance updateStatus(String slug, MaintenanceStatus newStatus) {
        var maintenance = findBySlug(slug);
        
        // Validar transiciones de estado
        validateStatusTransition(maintenance.getStatus(), newStatus);
        
        return maintenanceRepository.updateStatus(maintenance.getId(), newStatus);
    }

    /**
     * Valida que la transición de estado sea lógica.
     * 
     * @param current El estado actual del mantenimiento.
     * @param target El nuevo estado al que se desea transicionar.
     * @throws IllegalArgumentException si el mantenimiento ya está en un estado final 
     * o si la transición solicitada no es válida según las reglas de negocio.
     */
    private void validateStatusTransition(MaintenanceStatus current, MaintenanceStatus target) {
        // CANCELLED y COMPLETED son estados finales
        if (current == MaintenanceStatus.CANCELLED || current == MaintenanceStatus.COMPLETED) {
            throw new IllegalArgumentException(
                "No se puede cambiar el estado de un mantenimiento que ya está " + current + "."
            );
        }

        // SCHEDULED puede ir a IN_PROGRESS o CANCELLED
        if (current == MaintenanceStatus.SCHEDULED &&
            target != MaintenanceStatus.IN_PROGRESS &&
            target != MaintenanceStatus.CANCELLED) {
            throw new IllegalArgumentException(
                "Un mantenimiento SCHEDULED solo puede pasar a IN_PROGRESS o CANCELLED."
            );
        }

        // IN_PROGRESS puede ir a COMPLETED o CANCELLED
        if (current == MaintenanceStatus.IN_PROGRESS &&
            target != MaintenanceStatus.COMPLETED &&
            target != MaintenanceStatus.CANCELLED) {
            throw new IllegalArgumentException(
                "Un mantenimiento IN_PROGRESS solo puede pasar a COMPLETED o CANCELLED."
            );
        }
    }

    /**
     * Actualiza un mantenimiento existente.
     * Si cambian las horas, se validan conflictos con otros mantenimientos y se cancelan 
     * automáticamente las reservas que queden dentro del nuevo rango horario.
     * 
     * Solo se permite la edición si el mantenimiento está en estado SCHEDULED.
     * No se permite cambiar la pista ni el usuario creador.
     *
     * @param slug El identificador único del mantenimiento a actualizar.
     * @param request DTO con los nuevos datos (título, descripción, fechas).
     * @return Un {@link MaintenanceCreationResult} con el mantenimiento actualizado y el conteo de nuevas reservas canceladas.
     * @throws IllegalArgumentException si el estado no es SCHEDULED, las fechas son inválidas o hay solapamiento.
     * @throws ResourceNotFoundException si el mantenimiento no existe.
     */
    @Transactional
    public MaintenanceCreationResult updateMaintenance(String slug, UpdateMaintenanceRequest request) {
        var maintenance = findBySlug(slug);

        // Solo se puede editar si está SCHEDULED
        if (maintenance.getStatus() != MaintenanceStatus.SCHEDULED) {
            throw new IllegalArgumentException(
                "Solo se pueden editar mantenimientos en estado SCHEDULED. Estado actual: " + 
                maintenance.getStatus()
            );
        }

        // Validar fechas
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException(
                "La fecha de fin debe ser posterior a la fecha de inicio."
            );
        }

        // Verificar si cambiaron las horas
        boolean hoursChanged = !maintenance.getStartTime().equals(request.startTime()) ||
                               !maintenance.getEndTime().equals(request.endTime());

        int cancelledCount = 0;

        if (hoursChanged) {
            if (DateTimeUtils.isPast(request.startTime())) {
                throw new IllegalArgumentException(
                    "La fecha de inicio no puede estar en el pasado."
                );
            }

            // Verificar que no haya otro mantenimiento superpuesto (excluyendo el actual)
            var overlappingMaintenances = maintenanceRepository.findOverlappingMaintenancesExcluding(
                maintenance.getCourt().getId(),
                request.startTime(),
                request.endTime(),
                maintenance.getId()
            );

            if (!overlappingMaintenances.isEmpty()) {
                throw new IllegalArgumentException(
                    "Ya existe otro mantenimiento programado para la pista en ese rango de tiempo."
                );
            }

            // Cancelar las reservas en el NUEVO rango de tiempo
            cancelledCount = bookingRepository.cancelBookingsInRange(
                maintenance.getCourt().getId(),
                request.startTime(),
                request.endTime()
            );

            if (cancelledCount > 0) {
                log.info("Se cancelaron {} reservas debido a la actualización del mantenimiento en pista {}.",
                    cancelledCount, maintenance.getCourt().getName());
            }

            maintenance.setStartTime(request.startTime());
            maintenance.setEndTime(request.endTime());
        }

        // Actualizar título y descripción
        if (request.title() != null && !request.title().isBlank()) {
            maintenance.setTitle(request.title());
        }
        maintenance.setDescription(request.description());

        var updatedMaintenance = maintenanceRepository.update(maintenance);

        return new MaintenanceCreationResult(updatedMaintenance, cancelledCount);
    }

    /**
     * Cancela un mantenimiento existente cambiando su estado a CANCELLED.
     *
     * @param slug El identificador único del mantenimiento a cancelar.
     * @throws ResourceNotFoundException si el mantenimiento no existe.
     */
    @Transactional
    public void cancelMaintenance(String slug) {
        var maintenance = findBySlug(slug);
        maintenanceRepository.updateStatus(maintenance.getId(), MaintenanceStatus.CANCELLED);
        log.info("Mantenimiento {} cancelado.", slug);
    }

    /**
     * Elimina físicamente un mantenimiento de la base de datos.
     *
     * @param slug El identificador único del mantenimiento a eliminar.
     * @throws ResourceNotFoundException si el mantenimiento no existe.
     */
    @Transactional
    public void deleteMaintenance(String slug) {
        var maintenance = findBySlug(slug);
        maintenanceRepository.deleteById(maintenance.getId());
        log.info("Mantenimiento {} eliminado.", slug);
    }
}
