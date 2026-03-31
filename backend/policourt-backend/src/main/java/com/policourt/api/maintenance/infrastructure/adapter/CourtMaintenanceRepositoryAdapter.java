package com.policourt.api.maintenance.infrastructure.adapter;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Repository;

import com.policourt.api.court.infrastructure.repository.CourtJpaRepository;
import com.policourt.api.maintenance.domain.enums.MaintenanceStatusEnum;
import com.policourt.api.maintenance.domain.model.CourtMaintenance;
import com.policourt.api.maintenance.domain.repository.CourtMaintenanceRepository;
import com.policourt.api.maintenance.infrastructure.entity.CourtMaintenanceEntity;
import com.policourt.api.maintenance.infrastructure.mapper.CourtMaintenanceMapper;
import com.policourt.api.maintenance.infrastructure.repository.CourtMaintenanceJpaRepository;
import com.policourt.api.user.infrastructure.repository.UserJpaRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CourtMaintenanceRepositoryAdapter implements CourtMaintenanceRepository {

    private final CourtMaintenanceJpaRepository maintenanceJpaRepository;
    private final CourtMaintenanceMapper maintenanceMapper;
    private final CourtJpaRepository courtJpaRepository;
    private final UserJpaRepository userJpaRepository;

    @Override
    public CourtMaintenance save(CourtMaintenance maintenance) {
        CourtMaintenanceEntity entity;

        if (maintenance.getId() != null) {
            entity = maintenanceJpaRepository.findById(maintenance.getId())
                    .orElseGet(() -> maintenanceMapper.toEntity(maintenance));
            maintenanceMapper.updateEntity(entity, maintenance);
        } else {
            entity = maintenanceMapper.toEntity(maintenance);
        }

        if (maintenance.getCourt() != null && maintenance.getCourt().getId() != null) {
            var court = courtJpaRepository.findById(maintenance.getCourt().getId())
                    .orElseThrow(() -> new RuntimeException("Court not found with id: " + maintenance.getCourt().getId()));
            entity.setCourt(court);
        }

        if (maintenance.getCreatedBy() != null && maintenance.getCreatedBy().getId() != null) {
            var user = userJpaRepository.findById(maintenance.getCreatedBy().getId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + maintenance.getCreatedBy().getId()));
            entity.setCreatedBy(user);
        }

        return maintenanceMapper.toDomain(maintenanceJpaRepository.save(entity));
    }

    @Override
    public boolean existsActiveOverlap(Long courtId, OffsetDateTime startTime, OffsetDateTime endTime) {
        return maintenanceJpaRepository.existsActiveOverlap(courtId, startTime, endTime);
    }

    @Override
    public List<CourtMaintenance> findActiveOverlaps(Long courtId, OffsetDateTime startTime, OffsetDateTime endTime) {
        return maintenanceJpaRepository.findActiveOverlaps(courtId, startTime, endTime)
                .stream()
                .map(maintenanceMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<CourtMaintenance> findByUuid(String uuid) {
        try {
            return maintenanceJpaRepository.findByUuid(UUID.fromString(uuid))
                    .map(maintenanceMapper::toDomain);
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    @Override
    public void updateStatus(Long id, MaintenanceStatusEnum status) {
        maintenanceJpaRepository.findById(id).ifPresent(entity -> {
            entity.setStatus(status);
            maintenanceJpaRepository.save(entity);
        });
    }
}
