package com.policourt.api.maintenance.infrastructure.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.policourt.api.maintenance.infrastructure.entity.CourtMaintenanceEntity;

public interface CourtMaintenanceJpaRepository extends JpaRepository<CourtMaintenanceEntity, Long> {
    Optional<CourtMaintenanceEntity> findByUuid(UUID uuid);

    @Query("SELECT CASE WHEN COUNT(cm) > 0 THEN TRUE ELSE FALSE END FROM CourtMaintenanceEntity cm "
            + "WHERE cm.court.id = :courtId "
            + "AND cm.isActive = TRUE "
            + "AND cm.status IN ('SCHEDULED','IN_PROGRESS') "
            + "AND cm.startTime < :endTime AND cm.endTime > :startTime")
    boolean existsActiveOverlap(@Param("courtId") Long courtId,
            @Param("startTime") OffsetDateTime startTime,
            @Param("endTime") OffsetDateTime endTime);

    @Query("SELECT cm FROM CourtMaintenanceEntity cm "
            + "WHERE cm.court.id = :courtId "
            + "AND cm.isActive = TRUE "
            + "AND cm.status IN ('SCHEDULED','IN_PROGRESS') "
            + "AND cm.startTime < :endTime AND cm.endTime > :startTime")
    List<CourtMaintenanceEntity> findActiveOverlaps(@Param("courtId") Long courtId,
            @Param("startTime") OffsetDateTime startTime,
            @Param("endTime") OffsetDateTime endTime);
}
