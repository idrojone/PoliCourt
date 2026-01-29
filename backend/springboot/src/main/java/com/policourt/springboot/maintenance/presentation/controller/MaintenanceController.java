package com.policourt.springboot.maintenance.presentation.controller;

import com.policourt.springboot.maintenance.application.mapper.MaintenanceDtoMapper;
import com.policourt.springboot.maintenance.application.service.MaintenanceService;
import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import com.policourt.springboot.maintenance.presentation.request.CreateMaintenanceRequest;
import com.policourt.springboot.maintenance.presentation.request.UpdateMaintenanceStatusRequest;
import com.policourt.springboot.maintenance.presentation.response.MaintenanceCreatedResponse;
import com.policourt.springboot.maintenance.presentation.response.MaintenanceResponse;
import com.policourt.springboot.shared.presentation.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenances")
@RequiredArgsConstructor
@Tag(name = "Maintenances", description = "Endpoints para la gestión de mantenimientos de pistas")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;
    private final MaintenanceDtoMapper maintenanceDtoMapper;

    // ========================
    // ENDPOINTS DE LECTURA
    // ========================

    @Operation(
        summary = "Obtener todos los mantenimientos",
        description = "Recupera la lista de todos los mantenimientos programados."
    )
    @GetMapping
    public ResponseEntity<ApiResponse<List<MaintenanceResponse>>> getAllMaintenances() {
        var maintenances = maintenanceService.findAll()
            .stream()
            .map(maintenanceDtoMapper::toResponse)
            .toList();
        return ResponseEntity.ok(
            ApiResponse.success(maintenances, "Mantenimientos recuperados correctamente.")
        );
    }

    @Operation(
        summary = "Obtener mantenimiento por slug",
        description = "Recupera los detalles de un mantenimiento específico."
    )
    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> getMaintenanceBySlug(
        @Parameter(description = "Slug del mantenimiento") @PathVariable String slug
    ) {
        var maintenance = maintenanceService.findBySlug(slug);
        return ResponseEntity.ok(
            ApiResponse.success(
                maintenanceDtoMapper.toResponse(maintenance),
                "Mantenimiento recuperado correctamente."
            )
        );
    }

    @Operation(
        summary = "Obtener mantenimientos por pista",
        description = "Recupera todos los mantenimientos de una pista específica."
    )
    @GetMapping("/court/{courtSlug}")
    public ResponseEntity<ApiResponse<List<MaintenanceResponse>>> getMaintenancesByCourtSlug(
        @Parameter(description = "Slug de la pista") @PathVariable String courtSlug
    ) {
        var maintenances = maintenanceService.findByCourtSlug(courtSlug)
            .stream()
            .map(maintenanceDtoMapper::toResponse)
            .toList();
        return ResponseEntity.ok(
            ApiResponse.success(maintenances, "Mantenimientos de la pista recuperados correctamente.")
        );
    }

    @Operation(
        summary = "Obtener mantenimientos por estado",
        description = "Recupera todos los mantenimientos con un estado específico."
    )
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<MaintenanceResponse>>> getMaintenancesByStatus(
        @Parameter(description = "Estado del mantenimiento") @PathVariable MaintenanceStatus status
    ) {
        var maintenances = maintenanceService.findByStatus(status)
            .stream()
            .map(maintenanceDtoMapper::toResponse)
            .toList();
        return ResponseEntity.ok(
            ApiResponse.success(maintenances, "Mantenimientos con estado " + status + " recuperados.")
        );
    }

    // ========================
    // ENDPOINTS DE ESCRITURA
    // ========================

    @Operation(
        summary = "Programar un mantenimiento",
        description = "Crea un nuevo mantenimiento para una pista. IMPORTANTE: Las reservas existentes en el rango de tiempo serán canceladas automáticamente."
    )
    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceCreatedResponse>> createMaintenance(
        @Valid @RequestBody CreateMaintenanceRequest request
    ) {
        var result = maintenanceService.createMaintenance(request);
        
        String message = result.cancelledBookingsCount() > 0
            ? String.format(
                "Mantenimiento programado con éxito. Se cancelaron %d reserva(s) en conflicto.",
                result.cancelledBookingsCount()
            )
            : "Mantenimiento programado con éxito.";

        var response = new MaintenanceCreatedResponse(
            maintenanceDtoMapper.toResponse(result.maintenance()),
            result.cancelledBookingsCount(),
            message
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(response, message)
        );
    }

    @Operation(
        summary = "Actualizar estado del mantenimiento",
        description = "Actualiza el estado de un mantenimiento (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)."
    )
    @PatchMapping("/{slug}/status")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> updateMaintenanceStatus(
        @Parameter(description = "Slug del mantenimiento") @PathVariable String slug,
        @Valid @RequestBody UpdateMaintenanceStatusRequest request
    ) {
        var maintenance = maintenanceService.updateStatus(slug, request.status());
        return ResponseEntity.ok(
            ApiResponse.success(
                maintenanceDtoMapper.toResponse(maintenance),
                "Estado del mantenimiento actualizado correctamente."
            )
        );
    }

    @Operation(
        summary = "Cancelar mantenimiento",
        description = "Cancela un mantenimiento programado."
    )
    @PatchMapping("/{slug}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelMaintenance(
        @Parameter(description = "Slug del mantenimiento") @PathVariable String slug
    ) {
        maintenanceService.cancelMaintenance(slug);
        return ResponseEntity.ok(
            ApiResponse.success(null, "Mantenimiento cancelado correctamente.")
        );
    }

    @Operation(
        summary = "Eliminar mantenimiento",
        description = "Elimina permanentemente un mantenimiento."
    )
    @DeleteMapping("/{slug}")
    public ResponseEntity<ApiResponse<Void>> deleteMaintenance(
        @Parameter(description = "Slug del mantenimiento") @PathVariable String slug
    ) {
        maintenanceService.deleteMaintenance(slug);
        return ResponseEntity.ok(
            ApiResponse.success(null, "Mantenimiento eliminado correctamente.")
        );
    }
}
