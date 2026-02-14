package com.policourt.api.court.presentation.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.api.court.application.CourtService;
import com.policourt.api.court.domain.enums.CourtSurfaceEnum;
import com.policourt.api.court.presentation.mapper.CourtPresentationMapper;
import com.policourt.api.court.presentation.response.CourtResponse;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.shared.response.ApiResponse;
import com.policourt.api.shared.response.PaginatedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
@Tag(name = "Pistas", description = "Endpoints para la gestión de pistas deportivas")
public class CourtController {

    private final CourtService courtService;
    private final CourtPresentationMapper courtMapper;

    @GetMapping
    @Operation(summary = "Buscar pistas", description = "Busca pistas con filtros opcionales, paginación y ordenamiento")
    public ResponseEntity<ApiResponse<PaginatedResponse<CourtResponse>>> search(
            @Parameter(description = "Texto de búsqueda (nombre o ubicación)") @RequestParam(required = false) String q,
            @Parameter(description = "Filtrar por nombre") @RequestParam(required = false) String name,
            @Parameter(description = "Filtrar por ubicación") @RequestParam(required = false) String locationDetails,
            @Parameter(description = "Precio mínimo") @RequestParam(required = false) BigDecimal priceMin,
            @Parameter(description = "Precio máximo") @RequestParam(required = false) BigDecimal priceMax,
            @Parameter(description = "Capacidad mínima") @RequestParam(required = false) Integer capacityMin,
            @Parameter(description = "Capacidad máxima") @RequestParam(required = false) Integer capacityMax,
            @Parameter(description = "Filtrar por interior/exterior") @RequestParam(required = false) Boolean isIndoor,
            @Parameter(description = "Filtrar por superficie") @RequestParam(required = false) List<CourtSurfaceEnum> surfaces,
            @Parameter(description = "Filtrar por estados") @RequestParam(required = false) List<GeneralStatus> statuses,
            @Parameter(description = "Filtrar por deportes (slugs)") @RequestParam(required = false) List<String> sports,
            @Parameter(description = "Filtrar por activo/inactivo") @RequestParam(required = false) Boolean isActive,
            @Parameter(description = "Número de página (1-indexed)") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "Cantidad de elementos por página") @RequestParam(defaultValue = "10") int limit,
            @Parameter(description = "Ordenamiento") @RequestParam(defaultValue = "name_asc") String sort) {
        
        return ResponseEntity.ok(ApiResponse.success(
                courtMapper.toPaginatedResponse(
                    courtService.getCourts(
                        name,
                        locationDetails,
                        priceMin,
                        priceMax,
                        capacityMin,
                        capacityMax,
                        isIndoor,
                        surfaces,
                        statuses,
                        isActive,
                        sports,
                        page,
                        limit,
                        sort
                    )
                ),
                "Pistas obtenidas exitosamente"));
    }
}
