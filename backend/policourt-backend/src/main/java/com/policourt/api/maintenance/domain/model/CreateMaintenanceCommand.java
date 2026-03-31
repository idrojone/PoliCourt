package com.policourt.api.maintenance.domain.model;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMaintenanceCommand {
    private String courtSlug;
    private String createdByUsername;
    private String title;
    private String description;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
}
