package com.policourt.springboot.maintenance.infrastructure.adapter;

import com.policourt.springboot.maintenance.domain.model.Maintenance;
import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import com.policourt.springboot.maintenance.domain.repository.MaintenanceRepository;
import com.policourt.springboot.maintenance.infrastructure.mapper.MaintenanceEntityMapper;
import com.policourt.springboot.maintenance.infrastructure.entity.MaintenanceEntity;
import com.policourt.springboot.maintenance.infrastructure.repository.MaintenanceJpaRepository;
import com.policourt.springboot.maintenance.infrastructure.specifications.MaintenanceSpecifications;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Adaptador de infraestructura que implementa el contrato del repositorio de
 * mantenimientos.
 * Se encarga de la comunicación con la base de datos a través de JPA y la
 * conversión entre
 * entidades de persistencia y modelos de dominio.
 */
@Repository
@RequiredArgsConstructor
public class MaintenanceRepositoryAdapter implements MaintenanceRepository {

    private final MaintenanceJpaRepository maintenanceJpaRepository;
    private final MaintenanceEntityMapper maintenanceEntityMapper;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Maintenance save(Maintenance maintenance) {
        var entity = maintenanceEntityMapper.toEntity(maintenance);
        if (entity == null)
            throw new IllegalArgumentException("Maintenance no puede ser null");
        var savedEntity = maintenanceJpaRepository.save(entity);
        var domain = maintenanceEntityMapper.toDomain(savedEntity);
        if (domain == null) {
            throw new IllegalStateException("El mapeo a dominio no puede ser null");
        }
        return domain;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Maintenance> findById(UUID id) {
        if (id == null)
            throw new IllegalArgumentException("El ID no puede ser null");
        return maintenanceJpaRepository.findById(id)
                .map(maintenanceEntityMapper::toDomain);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Maintenance> findBySlug(String slug) {
        return maintenanceJpaRepository.findAll(MaintenanceSpecifications.hasSlug(slug))
                .stream()
                .findFirst()
                .map(maintenanceEntityMapper::toDomain);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Maintenance> findAll() {
        return maintenanceJpaRepository.findAll()
                .stream()
                .map(maintenanceEntityMapper::toDomain)
                .filter(Objects::nonNull)
                .toList();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Maintenance> findByCourtId(UUID courtId) {
        return maintenanceJpaRepository.findAll(MaintenanceSpecifications.hasCourtId(courtId))
                .stream()
                .map(maintenanceEntityMapper::toDomain)
                .filter(Objects::nonNull)
                .toList();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Maintenance> findByStatus(MaintenanceStatus status) {
        return maintenanceJpaRepository.findAll(MaintenanceSpecifications.hasStatus(status))
                .stream()
                .map(maintenanceEntityMapper::toDomain)
                .filter(Objects::nonNull)
                .toList();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Maintenance> findOverlappingMaintenances(
            UUID courtId,
            LocalDateTime startTime,
            LocalDateTime endTime) {
        return maintenanceJpaRepository
                .findAll(MaintenanceSpecifications.overlappingMaintenances(courtId, startTime, endTime))
                .stream()
                .map(maintenanceEntityMapper::toDomain)
                .filter(Objects::nonNull)
                .toList();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Maintenance> findOverlappingMaintenancesExcluding(
            UUID courtId,
            LocalDateTime startTime,
            LocalDateTime endTime,
            UUID excludeMaintenanceId) {
        return maintenanceJpaRepository
                .findAll(MaintenanceSpecifications.overlappingMaintenancesExcluding(courtId, startTime, endTime,
                        excludeMaintenanceId))
                .stream()
                .map(maintenanceEntityMapper::toDomain)
                .filter(Objects::nonNull)
                .toList();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Maintenance updateStatus(UUID maintenanceId, MaintenanceStatus newStatus) {
        if (maintenanceId == null)
            throw new IllegalArgumentException("El ID no puede ser null");
        MaintenanceEntity entity = maintenanceJpaRepository.findById(maintenanceId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Mantenimiento con ID " + maintenanceId + " no encontrado."));
        entity.setStatus(newStatus);
        var savedEntity = maintenanceJpaRepository.save(entity);
        var domain = maintenanceEntityMapper.toDomain(savedEntity);
        if (domain == null) {
            throw new IllegalStateException("El mapeo a dominio no puede ser null");
        }
        return domain;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Maintenance update(Maintenance maintenance) {
        MaintenanceEntity entity = maintenanceJpaRepository.findById(maintenance.getId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Mantenimiento con ID " + maintenance.getId() + " no encontrado."));

        // Actualizar campos modificables
        entity.setTitle(maintenance.getTitle());
        entity.setDescription(maintenance.getDescription());
        entity.setStartTime(maintenance.getStartTime());
        entity.setEndTime(maintenance.getEndTime());
        entity.setStatus(maintenance.getStatus());

        var savedEntity = maintenanceJpaRepository.save(entity);
        var domain = maintenanceEntityMapper.toDomain(savedEntity);
        if (domain == null) {
            throw new IllegalStateException("El mapeo a dominio no puede ser null");
        }
        return domain;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public void deleteById(UUID id) {
        maintenanceJpaRepository.deleteById(id);
    }
}
