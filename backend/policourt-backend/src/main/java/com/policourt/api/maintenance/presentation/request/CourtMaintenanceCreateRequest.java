package com.policourt.api.maintenance.presentation.request;

import java.time.OffsetDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourtMaintenanceCreateRequest {

    @NotBlank
    private String courtSlug;

    @NotBlank
    private String createdByUsername;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private OffsetDateTime startTime;

    @NotNull
    private OffsetDateTime endTime;
}
