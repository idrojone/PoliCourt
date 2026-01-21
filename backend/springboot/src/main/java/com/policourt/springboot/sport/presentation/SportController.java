package com.policourt.springboot.sport.presentation;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.springboot.shared.presentation.ApiResponse;
import com.policourt.springboot.sport.application.service.SportService;
import com.policourt.springboot.sport.presentation.request.SportRequest;
import com.policourt.springboot.sport.presentation.request.SportStatusRequest;
import com.policourt.springboot.sport.presentation.response.SportResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
        return ResponseEntity.ok(ApiResponse.success(sportService.getAllSports().stream().map(SportResponse::fromDomain).toList(), "Lista de deportes obtenida correctamente"));
    }

    /**
     * 
     * @param request
     * @return
     */
    @Operation(summary = "Crear deporte", description = "Registra un nuevo deporte. Si no se envía slug, se genera automáticamente.")
    @PostMapping
    public ResponseEntity<ApiResponse<SportResponse>> create(@Valid @RequestBody SportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(SportResponse.fromDomain(sportService.createSport(request)), "Deporte creado exitosamente"));
    }

    /**
     * 
     * @param request
     * @return
     */
    @Operation(summary = "Actualizar deporte", description = "Actualiza los datos de un deporte existente.")
    @PutMapping("/{slug}")
    public ResponseEntity<ApiResponse<SportResponse>> update(@PathVariable String slug, @Valid @RequestBody SportRequest request) {
        return ResponseEntity.ok(ApiResponse.success(SportResponse.fromDomain(sportService.updateSport(slug, request)), "Deporte actualizado correctamente"));
    }

    /**
     * 
     * @param slug
     * @param request
     * @return
     */
    @Operation(summary = "Actualizar estado", description = "Actualiza el estado de un deporte")
    @PatchMapping("/{slug}/status")
    public ResponseEntity<ApiResponse<SportResponse>> updateStatus(@PathVariable String slug, @Valid @RequestBody SportStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.success(SportResponse.fromDomain(sportService.updateSportStatus(slug, request.status())), "Estado actualizado correctamente"));
    }

    /**
     * 
     * @param slug
     * @param request
     * @return
     */
    @Operation(summary = "Alternar visibilidad deporte", description = "Alterna (toggle) la visibilidad de un deporte automáticamente.")
    @PatchMapping("/{slug}/active")
    public ResponseEntity<ApiResponse<SportResponse>> toggleActive(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(SportResponse.fromDomain(sportService.toggleSportActive(slug)), "Deporte actualizado correctamente"));
    }

    /**
     * 
     * @param slug
     * @return
     */
    @Operation(summary = "Eliminar deporte", description = "Elimina un deporte existente por su slug.")
    @DeleteMapping("/{slug}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable String slug) { 
        sportService.deleteSportBySlug(slug); 
        return ResponseEntity.ok(ApiResponse.success("Deporte eliminado correctamente", "Deporte eliminado correctamente"));
    }

    

    

}
