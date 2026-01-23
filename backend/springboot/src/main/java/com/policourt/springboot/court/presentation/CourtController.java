package com.policourt.springboot.court.presentation;

import com.policourt.springboot.court.application.mapper.CourtDtoMapper;
import com.policourt.springboot.court.application.service.CourtService;
import com.policourt.springboot.court.presentation.request.CourtRequest;
import com.policourt.springboot.court.presentation.response.CourtResponse;
import com.policourt.springboot.shared.presentation.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
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

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
@Tag(
    name = "Pistas",
    description = "Operaciones para la gestión del catálogo de pistas"
)
public class CourtController {

    private final CourtService courtService;
    private final CourtDtoMapper courtDtoMapper;

    /**
     *
     * @param request
     * @return
     */
    // Crear una nueva pista
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

    // Obtener todas las pistas
    @Operation(
        summary = "Listar pistas",
        description = "Obtiene el listado completo de pistas registradas en el sistema"
    )
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourtResponse>>> getAll() {
        return ResponseEntity.ok(
            ApiResponse.success(
                courtService
                    .getAllCourts()
                    .stream()
                    .map(CourtResponse::fromDomain)
                    .toList(),
                "Lista de pistas obtenida correctamente"
            )
        );
    }

    // Actualizar pista
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

    // Actualizar status status
    @Operation(
        summary = "Actualizar estado de pista",
        description = "Actualiza el estado (PUBLISHED ...) de una pista"
    )
    @PatchMapping("/{slug}/status/{status}")
    public ResponseEntity<ApiResponse<CourtResponse>> updateStatus(
        @PathVariable String slug,
        @PathVariable String status
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

    // Actualizar isActive pista
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
                CourtResponse.fromDomain(courtService.toggleSportActive(slug)),
                "Estado de la pista actualizado correctamente"
            )
        );
    }
}
