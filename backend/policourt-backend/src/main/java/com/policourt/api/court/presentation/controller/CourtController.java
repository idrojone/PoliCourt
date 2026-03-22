package com.policourt.api.court.presentation.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.api.court.application.CourtService;
import com.policourt.api.court.presentation.mapper.CourtPresentationMapper;
import com.policourt.api.court.presentation.request.CourtCreateRequest;
import com.policourt.api.court.presentation.request.CourtSearchRequest;
import com.policourt.api.court.presentation.request.CourtStatusUpdateRequest;
import com.policourt.api.court.presentation.request.CourtUpdateRequest;
import com.policourt.api.court.presentation.response.CourtResponse;
import com.policourt.api.shared.response.ApiResponse;
import com.policourt.api.shared.response.PaginatedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
@Tag(name = "Pistas", description = "Endpoints para la gestión de pistas deportivas")
public class CourtController {

        private final CourtService courtService;
        private final CourtPresentationMapper courtMapper;

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Crear pista", description = "Crea una nueva pista deportiva")
        public ResponseEntity<ApiResponse<CourtResponse>> create(
                        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la nueva pista") @RequestBody @Valid CourtCreateRequest request) {

                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                                courtMapper.toResponse(courtService.createCourt(courtMapper.toDomain(request))),
                                "Pista creada exitosamente"));
        }

        @PutMapping("/{slug}")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Actualizar pista", description = "Actualiza una pista existente")
        public ResponseEntity<ApiResponse<CourtResponse>> update(
                        @Parameter(description = "Slug de la pista") @PathVariable String slug,
                        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos actualizados de la pista") @RequestBody @Valid CourtUpdateRequest request) {

                return ResponseEntity.ok(ApiResponse.success(
                                courtMapper.toResponse(courtService.updateCourt(slug, courtMapper.toDomain(request))),
                                "Pista actualizada exitosamente"));
        }

        @DeleteMapping("/{slug}")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Eliminar pista", description = "Realiza un borrado lógico de la pista (is_active = false)")
        public ResponseEntity<Void> delete(
                        @Parameter(description = "Slug de la pista") @PathVariable String slug) {
                courtService.deleteCourt(slug);
                return ResponseEntity.noContent().build();
        }

        @PatchMapping("/{slug}/restore")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Restaurar pista", description = "Restaura una pista eliminada lógicamente (is_active = true)")
        public ResponseEntity<Void> restore(
                        @Parameter(description = "Slug de la pista") @PathVariable String slug) {
                courtService.restoreCourt(slug);
                return ResponseEntity.noContent().build();
        }

        @PatchMapping("/{slug}/status")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Cambiar estado de pista", description = "Cambia el estado general de la pista (ej: PUBLISHED, DRAFT, ARCHIVED)")
        public ResponseEntity<ApiResponse<CourtResponse>> changeStatus(
                        @Parameter(description = "Slug de la pista") @PathVariable String slug,
                        @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Nuevo estado de la pista") @RequestBody @Valid CourtStatusUpdateRequest request) {
                return ResponseEntity.ok(ApiResponse.success(
                                courtMapper.toResponse(courtService.changeStatus(slug, request.getStatus())),
                                "Estado de la pista actualizado exitosamente"));
        }

        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Buscar pistas", description = "Busca pistas con filtros opcionales, paginación y ordenamiento")
        public ResponseEntity<ApiResponse<PaginatedResponse<CourtResponse>>> search(
                        @ParameterObject @Valid CourtSearchRequest request) {

                return ResponseEntity.ok(ApiResponse.success(
                                courtMapper.toPaginatedResponse(
                                                courtService.getCourts(courtMapper.toCriteria(request))),
                                "Pistas obtenidas exitosamente"));
        }
}
