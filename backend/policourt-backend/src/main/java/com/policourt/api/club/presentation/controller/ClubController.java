package com.policourt.api.club.presentation.controller;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.api.club.application.ClubService;
import com.policourt.api.club.presentation.mapper.ClubPresentationMapper;
import com.policourt.api.club.presentation.request.ClubSearchRequest;
import com.policourt.api.club.presentation.response.ClubResponse;
import com.policourt.api.shared.response.ApiResponse;
import com.policourt.api.shared.response.PaginatedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.policourt.api.club.presentation.request.ClubCreateRequest;
import com.policourt.api.club.presentation.request.ClubUpdateRequest;
import com.policourt.api.club.presentation.request.ClubStatusUpdateRequest;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
@Tag(name = "Clubes", description = "Endpoints para la gestión de clubes")
public class ClubController {

        private final ClubService clubService;
        private final ClubPresentationMapper clubMapper;

        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Crear club", description = "Crea un nuevo club")
        public ResponseEntity<ApiResponse<ClubResponse>> create(
                        @RequestBody @Valid ClubCreateRequest request) {

                return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                                clubMapper.toResponse(clubService.createClub(clubMapper.toDomain(request))),
                                "Club creado exitosamente"));
        }

        @PutMapping("/{slug}")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Actualizar club", description = "Actualiza un club existente")
        public ResponseEntity<ApiResponse<ClubResponse>> update(
                        @PathVariable String slug,
                        @RequestBody @Valid ClubUpdateRequest request) {

                return ResponseEntity.ok(ApiResponse.success(
                                clubMapper.toResponse(clubService.updateClub(slug, clubMapper.toDomain(request))),
                                "Club actualizado exitosamente"));
        }

        @DeleteMapping("/{slug}")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Eliminar club", description = "Realiza un borrado lógico del club (is_active = false)")
        public ResponseEntity<Void> delete(@PathVariable String slug) {
                clubService.deleteClub(slug);
                return ResponseEntity.noContent().build();
        }

        @PatchMapping("/{slug}/restore")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Restaurar club", description = "Restaura un club eliminado lógicamente (is_active = true)")
        public ResponseEntity<Void> restore(@PathVariable String slug) {
                clubService.restoreClub(slug);
                return ResponseEntity.noContent().build();
        }

        @PatchMapping("/{slug}/status")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Cambiar estado del club", description = "Cambia el estado general del club (ej: PUBLISHED, DRAFT, ARCHIVED)")
        public ResponseEntity<ApiResponse<ClubResponse>> changeStatus(
                        @PathVariable String slug,
                        @RequestBody @Valid ClubStatusUpdateRequest request) {
                return ResponseEntity.ok(ApiResponse.success(
                                clubMapper.toResponse(clubService.changeStatus(slug, request.getStatus())),
                                "Estado del club actualizado exitosamente"));
        }

        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Buscar clubes", description = "Busca clubes con filtros opcionales, paginación y ordenamiento")
        public ResponseEntity<ApiResponse<PaginatedResponse<ClubResponse>>> search(
                        @ParameterObject @Valid ClubSearchRequest request) {

                return ResponseEntity.ok(ApiResponse.success(
                                clubMapper.toPaginatedResponse(
                                                clubService.getClubs(clubMapper.toCriteria(request))),
                                "Clubes obtenidos exitosamente"));
        }
}
