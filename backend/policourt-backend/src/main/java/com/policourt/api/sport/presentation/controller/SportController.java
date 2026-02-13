package com.policourt.api.sport.presentation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.shared.response.ApiResponse;
import com.policourt.api.shared.response.PaginatedResponse;
import com.policourt.api.sport.application.SportService;
import com.policourt.api.sport.presentation.mapper.SportPresentationMapper;
import com.policourt.api.sport.presentation.request.SportRequest;
import com.policourt.api.sport.presentation.response.SportAdminResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/sports")
@RequiredArgsConstructor
@Tag(name = "Deportes", description = "Endpoints para la gestión de deportes")
public class SportController {

    private final SportService sportService;
    private final SportPresentationMapper sportMapper;

    @GetMapping
    @Operation(summary = "Buscar deportes", description = "Busca deportes con filtros opcionales, paginación y ordenamiento")
    public ResponseEntity<ApiResponse<PaginatedResponse<SportAdminResponse>>> search(
            @Parameter(description = "Texto de búsqueda (nombre)") @RequestParam(required = false) String q,

            @Parameter(description = "Filtrar por estados (PUBLISHED, DRAFT, ARCHIVED, SUSPENDED)") @RequestParam(required = false) List<GeneralStatus> status,

            @Parameter(description = "Filtrar por activo/inactivo") @RequestParam(required = false) Boolean isActive,

            @Parameter(description = "Número de página (1-indexed)") @RequestParam(defaultValue = "1") int page,

            @Parameter(description = "Cantidad de elementos por página") @RequestParam(defaultValue = "10") int limit,

            @Parameter(description = "Ordenamiento: name_asc, name_desc, createdAt_asc, createdAt_desc") @RequestParam(defaultValue = "name_asc") String sort) {
        return ResponseEntity.ok(ApiResponse.success(
                sportMapper.toPaginatedResponse(sportService.searchSport(q, status, isActive, page, limit, sort)),
                "Deportes obtenidos exitosamente"));
    }

    @PostMapping
    @Operation(summary = "Crear deporte", description = "Crea un nuevo deporte")
    public ResponseEntity<ApiResponse<SportAdminResponse>> create(@Valid @RequestBody SportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        sportMapper.toResponse(sportService.createSport(sportMapper.toDomain(request))),
                        "Deporte creado exitosamente"));
    }

}
