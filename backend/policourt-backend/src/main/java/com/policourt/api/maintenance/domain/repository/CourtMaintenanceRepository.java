package com.policourt.api.maintenance.domain.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import com.policourt.api.maintenance.domain.enums.MaintenanceStatusEnum;
import com.policourt.api.maintenance.domain.model.CourtMaintenance;

public interface CourtMaintenanceRepository {
    CourtMaintenance save(CourtMaintenance maintenance);

    boolean existsActiveOverlap(Long courtId, OffsetDateTime startTime, OffsetDateTime endTime);

    List<CourtMaintenance> findActiveOverlaps(Long courtId, OffsetDateTime startTime, OffsetDateTime endTime);

    Optional<CourtMaintenance> findByUuid(String uuid);

    void updateStatus(Long id, MaintenanceStatusEnum status);
}
