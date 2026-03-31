package com.policourt.api.maintenance.presentation.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.api.maintenance.application.CourtMaintenanceService;
import com.policourt.api.maintenance.domain.model.CreateMaintenanceCommand;
import com.policourt.api.maintenance.presentation.mapper.CourtMaintenancePresentationMapper;
import com.policourt.api.maintenance.presentation.request.CourtMaintenanceCreateRequest;
import com.policourt.api.maintenance.presentation.response.MaintenanceCreationResponse;
import com.policourt.api.shared.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/maintenances")
@RequiredArgsConstructor
@Tag(name = "Maintenances", description = "Gestión de bloqueos e incidencias de mantenimiento")
public class CourtMaintenanceController {

    private final CourtMaintenanceService maintenanceService;
    private final CourtMaintenancePresentationMapper mapper;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear mantenimiento", description = "Registra un mantenimiento y cancela reservas solapadas con reembolso total")
    public ResponseEntity<ApiResponse<MaintenanceCreationResponse>> create(
            @RequestBody @Valid CourtMaintenanceCreateRequest request) {
        var command = CreateMaintenanceCommand.builder()
                .courtSlug(request.getCourtSlug())
                .createdByUsername(request.getCreatedByUsername())
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        var result = maintenanceService.createMaintenance(command);
        var response = mapper.toCreationResponse(result);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Mantenimiento creado y reservas afectadas canceladas"));
    }
}
