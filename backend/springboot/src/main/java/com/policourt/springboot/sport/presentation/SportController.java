package com.policourt.springboot.sport.presentation;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.springboot.shared.presentation.ApiResponse;
import com.policourt.springboot.sport.application.SportService;
import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.presentation.request.SportCreateRequest;
import com.policourt.springboot.sport.presentation.response.SportResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


/**
 * Controlador REST para la gestión de deportes.
 * Proporciona endpoints para crear, leer, actualizar y eliminar deportes.
 * 
 * @author Jordi Valls
 * @version 1.0.0
 * 
 */
@RestController
@RequestMapping("/api/sports")
@RequiredArgsConstructor
@Tag(name = "Deportes", description = "Operaciones para la gestión del catálogo de deportes")
public class SportController {

    private final SportService sportService;

    /**
     * 
     * @return
     */
    @Operation(summary = "Listar deportes", description = "Obtiene el listado completo de deportes registrados en el sistema")
    @GetMapping
    public ResponseEntity<ApiResponse<List<SportResponse>>> getAll() {
        List<SportResponse> response = sportService.getAllSports().stream()
                .map(SportResponse::fromDomain)
                .toList();
        return ResponseEntity.ok(ApiResponse.success(response, "Lista de deportes obtenida correctamente"));
    }

    /**
     * 
     * @param request
     * @return
     */
    @Operation(summary = "Crear deporte", description = "Registra un nuevo deporte. Si no se envía slug, se genera automáticamente.")
    @PostMapping
    public ResponseEntity<ApiResponse<SportResponse>> create(@Valid @RequestBody SportCreateRequest request) {
        Sport sport = sportService.createSport(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(SportResponse.fromDomain(sport), "Deporte creado exitosamente"));
    }
    
}
