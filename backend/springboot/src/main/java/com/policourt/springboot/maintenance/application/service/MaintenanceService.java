package com.policourt.springboot.maintenance.application.service;

import com.policourt.springboot.auth.domain.repository.UserRepository;
import com.policourt.springboot.booking.domain.repository.BookingRepository;
import com.policourt.springboot.court.domain.repository.CourtRepository;
import com.policourt.springboot.maintenance.domain.model.Maintenance;
import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import com.policourt.springboot.maintenance.domain.repository.MaintenanceRepository;
import com.policourt.springboot.maintenance.presentation.request.CreateMaintenanceRequest;
import com.policourt.springboot.shared.application.exception.ResourceNotFoundException;
import com.policourt.springboot.shared.utils.SlugGenerator;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
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

    /**
     * Resultado de la creación de un mantenimiento, incluye cantidad de reservas canceladas.
     */
    public record MaintenanceCreationResult(Maintenance maintenance, int cancelledBookingsCount) {}

    /**
     * Programa un nuevo mantenimiento y cancela automáticamente las reservas en conflicto.
     */
    @Transactional
    public MaintenanceCreationResult createMaintenance(CreateMaintenanceRequest request) {
        // 1. Validar fechas
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
        LocalDateTime startLocal = request.startTime().toLocalDateTime();
        LocalDateTime endLocal = request.endTime().toLocalDateTime();
        
        int cancelledCount = bookingRepository.cancelBookingsInRange(
            court.getId(),
            startLocal,
            endLocal
        );

        if (cancelledCount > 0) {
            log.info("Se cancelaron {} reservas debido al mantenimiento programado en pista {}.",
                cancelledCount, court.getName());
        }

        // 6. Crear el mantenimiento
        var maintenance = Maintenance.builder()
            .court(court)
            .createdBy(createdBy)
            .title(request.title())
            .description(request.description())
            .startTime(request.startTime())
            .endTime(request.endTime())
            .status(request.status())
            .build();

        // 7. Generar slug
        String titleForSlug = maintenance.getTitle() != null && !maintenance.getTitle().isBlank()
            ? maintenance.getTitle()
            : "mantenimiento";
        maintenance.setSlug(slugGenerator.generate(titleForSlug));

        // 8. Guardar
        var savedMaintenance = maintenanceRepository.save(maintenance);

        return new MaintenanceCreationResult(savedMaintenance, cancelledCount);
    }

    @Transactional(readOnly = true)
    public Maintenance findBySlug(String slug) {
        return maintenanceRepository.findBySlug(slug)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Mantenimiento con slug: " + slug + " no encontrado."
            ));
    }

    @Transactional(readOnly = true)
    public List<Maintenance> findAll() {
        return maintenanceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Maintenance> findByCourtSlug(String courtSlug) {
        var court = courtRepository.findBySlug(courtSlug)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Pista con slug: " + courtSlug + " no encontrada."
            ));
        return maintenanceRepository.findByCourtId(court.getId());
    }

    @Transactional(readOnly = true)
    public List<Maintenance> findByStatus(MaintenanceStatus status) {
        return maintenanceRepository.findByStatus(status);
    }

    @Transactional
    public Maintenance updateStatus(String slug, MaintenanceStatus newStatus) {
        var maintenance = findBySlug(slug);
        return maintenanceRepository.updateStatus(maintenance.getId(), newStatus);
    }

    @Transactional
    public void cancelMaintenance(String slug) {
        var maintenance = findBySlug(slug);
        maintenanceRepository.updateStatus(maintenance.getId(), MaintenanceStatus.CANCELLED);
        log.info("Mantenimiento {} cancelado.", slug);
    }

    @Transactional
    public void deleteMaintenance(String slug) {
        var maintenance = findBySlug(slug);
        maintenanceRepository.deleteById(maintenance.getId());
        log.info("Mantenimiento {} eliminado.", slug);
    }
}
