package com.policourt.api.booking.presentation.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.policourt.api.booking.application.BookingService;
import com.policourt.api.booking.presentation.mapper.BookingPresentationMapper;
import com.policourt.api.booking.presentation.request.BookingClassCreateRequest;
import com.policourt.api.booking.presentation.request.BookingClassUpdateRequest;
import com.policourt.api.booking.presentation.request.BookingRentalCreateRequest;
import com.policourt.api.booking.presentation.request.BookingRentalUpdateRequest;
import com.policourt.api.booking.presentation.request.BookingSearchRequest;
import com.policourt.api.booking.presentation.request.BookingStatusUpdateRequest;
import com.policourt.api.booking.presentation.request.BookingTrainingCreateRequest;
import com.policourt.api.booking.presentation.request.BookingTrainingUpdateRequest;
import com.policourt.api.booking.presentation.response.BookedSlotResponse;
import com.policourt.api.booking.presentation.response.BookingResponse;
import com.policourt.api.court.application.CourtService;
import com.policourt.api.shared.response.ApiResponse;
import com.policourt.api.shared.response.PaginatedResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Endpoints para la gestión de reservas")
public class BookingController {

    private final BookingService bookingService;
    private final CourtService courtService;
    private final BookingPresentationMapper mapper;

    @GetMapping("/courts/{slug}")
    @Operation(summary = "Obtener reservas ocupadas de una pista", description = "Obtiene todas las reservas activas de una pista por su slug para bloquear horarios en el frontend")
    public ResponseEntity<ApiResponse<List<BookedSlotResponse>>> getBookedSlotsByCourtSlug(
            @Parameter(description = "Slug de la pista") @PathVariable String slug) {
        courtService.getCourtBySlug(slug);
        var bookings = bookingService.getBookedSlotsByCourtSlug(slug);
        var response = bookings.stream().map(mapper::toBookedSlotResponse).toList();

        return ResponseEntity.ok(ApiResponse.success(response, "Reservas de la pista obtenidas exitosamente"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar reservas", description = "Busca todas las reservas con filtros y paginación")
    public ResponseEntity<ApiResponse<PaginatedResponse<BookingResponse>>> searchAll(
            @ParameterObject @Valid BookingSearchRequest request) {
        var page = bookingService.getBookings(request.getQ(), request.getSportSlug(), request.getCourtSlug(),
                request.getOrganizerUsername(), request.getStatus(), request.getIsActive(), request.getPage(),
                request.getLimit(), request.getSort());
        return ResponseEntity.ok(ApiResponse.success(mapper.toPaginatedResponse(page), "Reservas obtenidas exitosamente"));
    }

    @GetMapping("/classes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar clases", description = "Busca reservas de tipo clase con filtros y paginación")
    public ResponseEntity<ApiResponse<PaginatedResponse<BookingResponse>>> searchClasses(
            @ParameterObject @Valid BookingSearchRequest request) {
        var page = bookingService.getClasses(request.getQ(), request.getSportSlug(), request.getCourtSlug(),
                request.getOrganizerUsername(), request.getStatus(), request.getIsActive(), request.getPage(),
                request.getLimit(), request.getSort());
        return ResponseEntity.ok(ApiResponse.success(mapper.toPaginatedResponse(page), "Clases obtenidas exitosamente"));
    }

    @GetMapping("/trainings")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar trainings", description = "Busca reservas de tipo training con filtros y paginación")
    public ResponseEntity<ApiResponse<PaginatedResponse<BookingResponse>>> searchTrainings(
            @ParameterObject @Valid BookingSearchRequest request,
            @RequestParam(required = false) @Parameter(description = "Slug del club") String clubSlug) {
        var page = bookingService.getTrainings(request.getQ(), request.getSportSlug(), request.getCourtSlug(),
                request.getOrganizerUsername(), clubSlug, request.getStatus(), request.getIsActive(), request.getPage(),
                request.getLimit(), request.getSort());
        return ResponseEntity.ok(ApiResponse.success(mapper.toPaginatedResponse(page), "Trainings obtenidos exitosamente"));
    }

    @PostMapping("/rentals")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear reserva rental", description = "Crea una reserva de tipo rental")
    public ResponseEntity<ApiResponse<BookingResponse>> createRental(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la reserva") @RequestBody @Valid BookingRentalCreateRequest request) {
        var booking = mapper.toDomain(request);
        var created = bookingService.createRental(booking);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(mapper.toResponse(created), "Reserva rental creada exitosamente"));
    }

    @PostMapping("/classes")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear reserva class", description = "Crea una reserva de tipo class")
    public ResponseEntity<ApiResponse<BookingResponse>> createClass(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la reserva") @RequestBody @Valid BookingClassCreateRequest request) {
        var booking = mapper.toDomain(request);
        var created = bookingService.createClass(booking);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(mapper.toResponse(created), "Reserva class creada exitosamente"));
    }

    @PostMapping("/trainings")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear reserva training", description = "Crea una reserva de tipo training")
    public ResponseEntity<ApiResponse<BookingResponse>> createTraining(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la reserva") @RequestBody @Valid BookingTrainingCreateRequest request) {
        var booking = mapper.toDomain(request);
        var created = bookingService.createTraining(booking);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(mapper.toResponse(created), "Reserva training creada exitosamente"));
    }

    @PutMapping("/rentals/{uuid}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar reserva rental", description = "Actualiza una reserva de tipo rental")
    public ResponseEntity<ApiResponse<BookingResponse>> updateRental(
            @Parameter(description = "UUID de la reserva") @PathVariable String uuid,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos actualizados") @RequestBody @Valid BookingRentalUpdateRequest request) {
        var booking = mapper.toDomain(request);
        var updated = bookingService.updateRental(uuid, booking);
        return ResponseEntity.ok(ApiResponse.success(mapper.toResponse(updated), "Reserva rental actualizada exitosamente"));
    }

    @PutMapping("/classes/{uuid}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar reserva class", description = "Actualiza una reserva de tipo class")
    public ResponseEntity<ApiResponse<BookingResponse>> updateClass(
            @Parameter(description = "UUID de la reserva") @PathVariable String uuid,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos actualizados") @RequestBody @Valid BookingClassUpdateRequest request) {
        var booking = mapper.toDomain(request);
        var updated = bookingService.updateClass(uuid, booking);
        return ResponseEntity.ok(ApiResponse.success(mapper.toResponse(updated), "Reserva class actualizada exitosamente"));
    }

    @PutMapping("/trainings/{uuid}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar reserva training", description = "Actualiza una reserva de tipo training")
    public ResponseEntity<ApiResponse<BookingResponse>> updateTraining(
            @Parameter(description = "UUID de la reserva") @PathVariable String uuid,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos actualizados") @RequestBody @Valid BookingTrainingUpdateRequest request) {
        var booking = mapper.toDomain(request);
        var updated = bookingService.updateTraining(uuid, booking);
        return ResponseEntity.ok(ApiResponse.success(mapper.toResponse(updated), "Reserva training actualizada exitosamente"));
    }


    @DeleteMapping("/{uuid}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar reserva", description = "Realiza borrado lógico de la reserva (isActive=false)")
    public ResponseEntity<Void> delete(@Parameter(description = "UUID de la reserva") @PathVariable String uuid) {
        bookingService.softDelete(uuid);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{uuid}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cambiar estado de reserva", description = "Actualiza el estado de una reserva")
    public ResponseEntity<ApiResponse<BookingResponse>> changeStatus(
            @Parameter(description = "UUID de la reserva") @PathVariable String uuid,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Nuevo estado") @RequestBody @Valid BookingStatusUpdateRequest request) {
        var updated = bookingService.changeStatus(uuid, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(mapper.toResponse(updated), "Estado de la reserva actualizado exitosamente"));
    }
}
