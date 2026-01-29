package com.policourt.springboot.maintenance.infrastructure.adapter;

import com.policourt.springboot.maintenance.domain.model.Maintenance;
import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import com.policourt.springboot.maintenance.domain.repository.MaintenanceRepository;
import com.policourt.springboot.maintenance.infrastructure.mapper.MaintenanceEntityMapper;
import com.policourt.springboot.maintenance.infrastructure.repository.MaintenanceJpaRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class MaintenanceRepositoryAdapter implements MaintenanceRepository {

    private final MaintenanceJpaRepository maintenanceJpaRepository;
    private final MaintenanceEntityMapper maintenanceEntityMapper;

    @Override
    @Transactional
    public Maintenance save(Maintenance maintenance) {
        var entity = maintenanceEntityMapper.toEntity(maintenance);
        var savedEntity = maintenanceJpaRepository.save(entity);
        return maintenanceEntityMapper.toDomain(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Maintenance> findById(UUID id) {
        return maintenanceJpaRepository.findById(id)
            .map(maintenanceEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Maintenance> findBySlug(String slug) {
        return maintenanceJpaRepository.findBySlug(slug)
            .map(maintenanceEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Maintenance> findAll() {
        return maintenanceJpaRepository.findAll()
            .stream()
            .map(maintenanceEntityMapper::toDomain)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Maintenance> findByCourtId(UUID courtId) {
        return maintenanceJpaRepository.findByCourtId(courtId)
            .stream()
            .map(maintenanceEntityMapper::toDomain)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Maintenance> findByStatus(MaintenanceStatus status) {
        return maintenanceJpaRepository.findByStatus(status)
            .stream()
            .map(maintenanceEntityMapper::toDomain)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Maintenance> findOverlappingMaintenances(
        UUID courtId,
        OffsetDateTime startTime,
        OffsetDateTime endTime
    ) {
        return maintenanceJpaRepository.findOverlappingMaintenances(courtId, startTime, endTime)
            .stream()
            .map(maintenanceEntityMapper::toDomain)
            .toList();
    }

    @Override
    @Transactional
    public Maintenance updateStatus(UUID maintenanceId, MaintenanceStatus newStatus) {
        var entity = maintenanceJpaRepository.findById(maintenanceId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Mantenimiento con ID " + maintenanceId + " no encontrado."
            ));
        entity.setStatus(newStatus);
        var savedEntity = maintenanceJpaRepository.save(entity);
        return maintenanceEntityMapper.toDomain(savedEntity);
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        maintenanceJpaRepository.deleteById(id);
    }
}
