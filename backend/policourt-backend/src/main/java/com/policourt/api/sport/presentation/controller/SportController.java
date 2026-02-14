package com.policourt.api.sport.presentation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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


    /**
     * Crea un nuevo deporte.
     *
     * @param request El objeto que contiene los datos del deporte a crear.
     * @return Una respuesta con el deporte creado y un mensaje de éxito.
     */
    @PostMapping
    @Operation(summary = "Crear deporte", description = "Crea un nuevo deporte")
    public ResponseEntity<ApiResponse<SportAdminResponse>> create(@Valid @RequestBody SportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        sportMapper.toResponse(sportService.createSport(sportMapper.toDomain(request))),
                        "Deporte creado exitosamente"));
    }



    /**
     * Actualiza un deporte existente utilizando su slug.
     *
     * @param slug    El slug único del deporte a actualizar.
     * @param request El objeto que contiene los datos actualizados del deporte.
     * @return Una respuesta con el deporte actualizado y un mensaje de éxito.
     */
    @PutMapping("/{slug}")
    @Operation(summary = "Actualizar deporte", description = "Actualiza un deporte existente")
    public ResponseEntity<ApiResponse<SportAdminResponse>> update(
            @PathVariable String slug,
            @Valid @RequestBody SportRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                sportMapper.toResponse(sportService.updateSport(slug, sportMapper.toDomain(request))),
                "Deporte actualizado exitosamente"));
    }

    @PatchMapping("/{slug}/status")
    @Operation(summary = "Actualizar estado del deporte", description = "Actualiza el estado de un deporte")
    public ResponseEntity<ApiResponse<SportAdminResponse>> updateStatus(
            @PathVariable String slug,
            @Valid @RequestBody GeneralStatus status) {
        return ResponseEntity.ok(ApiResponse.success(
                sportMapper.toResponse(sportService.updateStatus(slug, status)),
                "Estado del deporte actualizado exitosamente"));
    }

    @DeleteMapping("/{slug}")
    @Operation(summary = "Eliminar deporte", description = "Elimina un deporte")
    public ResponseEntity<Void> delete(@PathVariable String slug) {
        sportService.softDeleteSport(slug);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{slug}/restore")
    @Operation(summary = "Restaurar deporte", description = "Restaura un deporte eliminado")
    public ResponseEntity<ApiResponse<SportAdminResponse>> restore(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(
                sportMapper.toResponse(sportService.restoreSport(slug)),
                "Deporte restaurado exitosamente"));
    }
}
