package com.policourt.springboot.maintenance.presentation.controller;

import com.policourt.springboot.maintenance.application.mapper.MaintenanceDtoMapper;
import com.policourt.springboot.maintenance.application.service.MaintenanceService;
import com.policourt.springboot.maintenance.domain.model.MaintenanceStatus;
import com.policourt.springboot.maintenance.presentation.request.CreateMaintenanceRequest;
import com.policourt.springboot.maintenance.presentation.request.UpdateMaintenanceRequest;
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

/**
 * Controlador REST para la gestión de mantenimientos de pistas deportivas.
 */
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

    /**
     * Recupera la lista completa de mantenimientos registrados en el sistema.
     *
     * @return ResponseEntity con la lista de respuestas de mantenimiento.
     */
    @Operation(
        summary = "Obtener todos los mantenimientos",
        description = "Recupera la lista de todos los mantenimientos programados."
    )
    @GetMapping
    public ResponseEntity<ApiResponse<List<MaintenanceResponse>>> getAllMaintenances() {
        return ResponseEntity.ok(
            ApiResponse.success(maintenanceService.findAll().stream().map(maintenanceDtoMapper::toResponse).toList(), "Mantenimientos recuperados correctamente.")
        );
    }

    /**
     * Recupera un mantenimiento específico utilizando su slug único.
     *
     * @param slug El identificador amigable del mantenimiento.
     * @return ResponseEntity con los detalles del mantenimiento.
     */
    @Operation(
        summary = "Obtener mantenimiento por slug",
        description = "Recupera los detalles de un mantenimiento específico."
    )
    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> getMaintenanceBySlug(
        @Parameter(description = "Slug del mantenimiento") @PathVariable String slug
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                maintenanceDtoMapper.toResponse(maintenanceService.findBySlug(slug)),
                "Mantenimiento recuperado correctamente."
            )
        );
    }

    /**
     * Recupera todos los mantenimientos asociados a una pista específica.
     *
     * @param courtSlug El slug de la pista para filtrar los mantenimientos.
     * @return ResponseEntity con la lista de mantenimientos de la pista.
     */
    @Operation(
        summary = "Obtener mantenimientos por pista",
        description = "Recupera todos los mantenimientos de una pista específica."
    )
    @GetMapping("/court/{courtSlug}")
    public ResponseEntity<ApiResponse<List<MaintenanceResponse>>> getMaintenancesByCourtSlug(
        @Parameter(description = "Slug de la pista") @PathVariable String courtSlug
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(maintenanceService.findByCourtSlug(courtSlug).stream().map(maintenanceDtoMapper::toResponse).toList(), "Mantenimientos de la pista recuperados correctamente.")
        );
    }

    /**
     * Filtra los mantenimientos por su estado actual.
     *
     * @param status El estado por el cual filtrar (SCHEDULED, IN_PROGRESS, etc.).
     * @return ResponseEntity con la lista de mantenimientos filtrados.
     */
    @Operation(
        summary = "Obtener mantenimientos por estado",
        description = "Recupera todos los mantenimientos con un estado específico."
    )
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<MaintenanceResponse>>> getMaintenancesByStatus(
        @Parameter(description = "Estado del mantenimiento") @PathVariable MaintenanceStatus status
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(maintenanceService.findByStatus(status).stream().map(maintenanceDtoMapper::toResponse).toList(), "Mantenimientos con estado " + status + " recuperados.")
        );
    }

    // ========================
    // ENDPOINTS DE ESCRITURA
    // ========================

    /**
     * Crea y programa un nuevo mantenimiento.
     *
     * @param request DTO con la información necesaria para crear el mantenimiento.
     * @return ResponseEntity con el mantenimiento creado e información sobre reservas canceladas.
     */
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

    /**
     * Actualiza la información de un mantenimiento existente.
     *
     * @param slug El slug del mantenimiento a actualizar.
     * @param request DTO con los nuevos datos del mantenimiento.
     * @return ResponseEntity con el mantenimiento actualizado.
     */
    @Operation(
        summary = "Actualizar mantenimiento",
        description = "Actualiza un mantenimiento existente. Solo se puede actualizar si está en estado SCHEDULED. Si cambian los horarios, las reservas en el nuevo rango serán canceladas automáticamente."
    )
    @PutMapping("/{slug}")
    public ResponseEntity<ApiResponse<MaintenanceCreatedResponse>> updateMaintenance(
        @Parameter(description = "Slug del mantenimiento") @PathVariable String slug,
        @Valid @RequestBody UpdateMaintenanceRequest request
    ) {
        var result = maintenanceService.updateMaintenance(slug, request);
        
        String message = result.cancelledBookingsCount() > 0
            ? String.format(
                "Mantenimiento actualizado con éxito. Se cancelaron %d reserva(s) en conflicto.",
                result.cancelledBookingsCount()
            )
            : "Mantenimiento actualizado con éxito.";

        var response = new MaintenanceCreatedResponse(
            maintenanceDtoMapper.toResponse(result.maintenance()),
            result.cancelledBookingsCount(),
            message
        );

        return ResponseEntity.ok(
            ApiResponse.success(response, message)
        );
    }

    /**
     * Actualiza únicamente el estado de un mantenimiento.
     *
     * @param slug El slug del mantenimiento.
     * @param request DTO que contiene el nuevo estado.
     * @return ResponseEntity con el mantenimiento actualizado.
     */
    @Operation(
        summary = "Actualizar estado del mantenimiento",
        description = "Actualiza el estado de un mantenimiento (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)."
    )
    @PatchMapping("/{slug}/status")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> updateMaintenanceStatus(
        @Parameter(description = "Slug del mantenimiento") @PathVariable String slug,
        @Valid @RequestBody UpdateMaintenanceStatusRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                maintenanceDtoMapper.toResponse(maintenanceService.updateStatus(slug, request.status())),
                "Estado del mantenimiento actualizado correctamente."
            )
        );
    }

    /**
     * Cambia el estado de un mantenimiento a CANCELLED.
     *
     * @param slug El slug del mantenimiento a cancelar.
     * @return ResponseEntity indicando el éxito de la operación.
     */
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

    /**
     * Elimina físicamente un registro de mantenimiento de la base de datos.
     *
     * @param slug El slug del mantenimiento a eliminar.
     * @return ResponseEntity indicando el éxito de la operación.
     */
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
