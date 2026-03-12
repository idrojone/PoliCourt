package com.policourt.api.maintenance.domain.model;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.policourt.api.court.domain.model.Court;
import com.policourt.api.maintenance.domain.enums.MaintenanceStatusEnum;
import com.policourt.api.user.domain.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtMaintenance {
    private Long id;
    private UUID uuid;
    private Court court;
    private User createdBy;
    private String title;
    private String description;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private MaintenanceStatusEnum status;
    private Boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
