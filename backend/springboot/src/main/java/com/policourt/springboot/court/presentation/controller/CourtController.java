package com.policourt.springboot.court.presentation.controller;

import com.policourt.springboot.court.application.service.CourtService;
import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import com.policourt.springboot.court.presentation.request.CourtRequest;
import com.policourt.springboot.court.presentation.response.CourtResponse;
import com.policourt.springboot.shared.presentation.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PutExchange;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;




@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
@Tag(
    name = "Pistas",
    description = "Operaciones para la gestión del catálogo de pistas"
)
public class CourtController {

    private final CourtService courtService;

    /**
     * Crea una nueva pista deportiva en el sistema.
     *
     * @param request DTO con la información necesaria para crear la pista.
     * @return ResponseEntity con la pista creada y un mensaje de éxito.
     */
    @Operation(
        summary = "Crear pista",
        description = "Crea una nueva pista en el sistema"
    )
    @PostMapping
    public ResponseEntity<ApiResponse<CourtResponse>> create(
        @Valid @RequestBody CourtRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(
                CourtResponse.fromDomain(courtService.createCourt(request)),
                "Pista creada correctamente"
            )
        );
    }

    /**
     * Listar / Buscar pistas con búsqueda, filtros y paginación.
     *
     * @param q Texto de búsqueda (opcional)
     * @param name Nombre (opcional)
     * @param locationDetails Ubicación (opcional)
     * @param price_h Precio máximo (opcional)
     * @param capacity Capacidad mínima (opcional)
     * @param isIndoor Interior (opcional)
     * @param surface Superficie (opcional)
     * @param status Estado (opcional)
     * @param sports Lista de slugs de deportes (opcional). Permite 1 o varios slugs para filtrar por deportes.
     * @param isActive Activo (opcional)
     * @param page Página (1-based)
     * @param limit Tamaño de página
     * @param sort Orden
     * @return Página de resultados
     */
    @Operation(
        summary = "Listar / Buscar pistas",
        description = "Obtiene el listado de pistas aplicando búsqueda, filtros y paginación"
    )
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CourtResponse>>> getAll(
        @RequestParam(required = false) String q,
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String locationDetails,
        @RequestParam(required = false) BigDecimal priceMin,
        @RequestParam(required = false) BigDecimal priceMax,
        @RequestParam(required = false) Integer capacityMin,
        @RequestParam(required = false) Integer capacityMax,
        @RequestParam(required = false) Boolean isIndoor,
        @RequestParam(required = false) List<CourtSurface> surface,
        @RequestParam(required = false) List<CourtStatus> status,
        @RequestParam(required = false) List<String> sports,
        @RequestParam(required = false) Boolean isActive,
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit,
        @RequestParam(defaultValue = "id_asc") String sort
    ) {
        var pageResult = courtService
            .search(q, name, locationDetails, priceMin, priceMax, capacityMin, capacityMax, isIndoor, surface, status, sports, isActive, page, limit, sort)
            .map(CourtResponse::fromDomain);

        return ResponseEntity.ok(
            ApiResponse.success(
                pageResult,
                "Lista de pistas obtenida correctamente"
            )
        );
    }

    /**
     * Actualiza la información de una pista existente identificada por su slug.
     *
     * @param slug    Identificador amigable de la pista.
     * @param request DTO con los nuevos datos de la pista.
     * @return ResponseEntity con la pista actualizada.
     */
    @Operation(
        summary = "Actualizar pista",
        description = "Actualiza los datos de una pista existente"
    )
    @PutExchange("/{slug}")
    public ResponseEntity<ApiResponse<CourtResponse>> update(
        @PathVariable String slug,
        @Valid @RequestBody CourtRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                CourtResponse.fromDomain(
                    courtService.updateCourt(slug, request)
                ),
                "Pista actualizada correctamente"
            )
        );
    }

    /**
     * Actualiza el estado de publicación de una pista.
     *
     * @param slug   Identificador amigable de la pista.
     * @param status Nuevo estado (PUBLISHED, DRAFT, ARCHIVED, DELETED).
     * @return ResponseEntity con la pista y su nuevo estado.
     */
    @Operation(
        summary = "Actualizar estado de pista",
        description = "Actualiza el estado (PUBLISHED ...) de una pista"
    )
    @PatchMapping("/{slug}/status/{status}")
    public ResponseEntity<ApiResponse<CourtResponse>> updateStatus(
        @PathVariable String slug,
        @PathVariable CourtStatus status
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                CourtResponse.fromDomain(
                    courtService.updateCourtStatus(slug, status)
                ),
                "Estado de la pista actualizado correctamente"
            )
        );
    }

    /**
     * Alterna el estado de activación (borrado lógico) de una pista.
     *
     * @param slug Identificador amigable de la pista.
     * @return ResponseEntity con la pista y su nuevo estado de activación.
     */
    @Operation(
        summary = "Actualizar estado de pista",
        description = "Actualiza el estado (activo/inactivo) de una pista"
    )
    @PatchMapping("/{slug}/active")
    public ResponseEntity<ApiResponse<CourtResponse>> updateIsActive(
        @PathVariable String slug
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                CourtResponse.fromDomain(courtService.toggleCourtActive(slug)),
                "Estado de la pista actualizado correctamente"
            )
        );
    }
}
