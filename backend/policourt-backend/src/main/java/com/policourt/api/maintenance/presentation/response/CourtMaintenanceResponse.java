package com.policourt.api.maintenance.presentation.response;

import java.time.OffsetDateTime;

import com.policourt.api.maintenance.domain.enums.MaintenanceStatusEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtMaintenanceResponse {
    private String uuid;
    private String courtSlug;
    private String title;
    private String description;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private MaintenanceStatusEnum status;
    private Boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
