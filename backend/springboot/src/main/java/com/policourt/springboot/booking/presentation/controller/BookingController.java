package com.policourt.springboot.booking.presentation.controller;

import com.policourt.springboot.booking.application.mapper.BookingDtoMapper;
import com.policourt.springboot.booking.application.service.BookingService;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.presentation.request.CreateBookingRequest;
import com.policourt.springboot.booking.presentation.request.UpdateBookingActiveRequest;
import com.policourt.springboot.booking.presentation.request.UpdateBookingStatusRequest;
import com.policourt.springboot.booking.presentation.response.BookingResponse;
import com.policourt.springboot.shared.presentation.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Endpoints para la gestión de reservas")
public class BookingController {

    private final BookingService bookingService;
    private final BookingDtoMapper bookingDtoMapper;

    // ========================
    // ENDPOINTS GENERALES
    // ========================

    @Operation(
        summary = "Crear una nueva reserva",
        description = "Crea una nueva reserva genérica para una pista."
    )
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
        @Valid @RequestBody CreateBookingRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.createBooking(request)
                ),
                "Reserva creada con éxito."
            )
        );
    }

    @Operation(
        summary = "Recuperar reserva por slug",
        description = "Recupera los detalles de una reserva específica por su slug."
    )
    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingBySlug(
        @PathVariable String slug
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.findBookingBySlug(slug)
                ),
                "Reserva recuperada correctamente."
            )
        );
    }

    // ========================
    // ENDPOINTS POR TIPO
    // ========================

    @Operation(
        summary = "Obtener todas las reservas de alquiler",
        description = "Recupera todas las reservas de tipo RENTAL."
    )
    @GetMapping("/rentals")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getRentals() {
        return getBookingsByType(BookingType.RENTAL, "Alquileres recuperados correctamente.");
    }

    @Operation(
        summary = "Crear una reserva de alquiler",
        description = "Crea una nueva reserva de tipo RENTAL."
    )
    @PostMapping("/rentals")
    public ResponseEntity<ApiResponse<BookingResponse>> createRental(
        @Valid @RequestBody CreateBookingRequest request
    ) {
        return createBookingByType(request, BookingType.RENTAL, "Alquiler creado con éxito.");
    }

    @Operation(
        summary = "Obtener todas las clases",
        description = "Recupera todas las reservas de tipo CLASS."
    )
    @GetMapping("/classes")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getClasses() {
        return getBookingsByType(BookingType.CLASS, "Clases recuperadas correctamente.");
    }

    @Operation(
        summary = "Crear una clase",
        description = "Crea una nueva reserva de tipo CLASS."
    )
    @PostMapping("/classes")
    public ResponseEntity<ApiResponse<BookingResponse>> createClass(
        @Valid @RequestBody CreateBookingRequest request
    ) {
        return createBookingByType(request, BookingType.CLASS, "Clase creada con éxito.");
    }

    @Operation(
        summary = "Obtener todos los entrenamientos",
        description = "Recupera todas las reservas de tipo TRAINING."
    )
    @GetMapping("/trainings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getTrainings() {
        return getBookingsByType(BookingType.TRAINING, "Entrenamientos recuperados correctamente.");
    }

    @Operation(
        summary = "Crear un entrenamiento",
        description = "Crea una nueva reserva de tipo TRAINING."
    )
    @PostMapping("/trainings")
    public ResponseEntity<ApiResponse<BookingResponse>> createTraining(
        @Valid @RequestBody CreateBookingRequest request
    ) {
        return createBookingByType(request, BookingType.TRAINING, "Entrenamiento creado con éxito.");
    }

    @Operation(
        summary = "Obtener todos los torneos",
        description = "Recupera todas las reservas de tipo TOURNAMENT."
    )
    @GetMapping("/tournaments")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getTournaments() {
        return getBookingsByType(BookingType.TOURNAMENT, "Torneos recuperados correctamente.");
    }

    @Operation(
        summary = "Crear un torneo",
        description = "Crea una nueva reserva de tipo TOURNAMENT."
    )
    @PostMapping("/tournaments")
    public ResponseEntity<ApiResponse<BookingResponse>> createTournament(
        @Valid @RequestBody CreateBookingRequest request
    ) {
        return createBookingByType(request, BookingType.TOURNAMENT, "Torneo creado con éxito.");
    }

    // ========================
    // ENDPOINTS DE ACTUALIZACIÓN
    // ========================

    @Operation(
        summary = "Actualizar el estado de una reserva",
        description = "Actualiza el estado (CONFIRMED, PENDING, CANCELLED, COMPLETED) de una reserva específica."
    )
    @PatchMapping("/{slug}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
        @Parameter(description = "Slug de la reserva") @PathVariable String slug,
        @Valid @RequestBody UpdateBookingStatusRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.updateBookingStatus(slug, request.status())
                ),
                "Estado de la reserva actualizado correctamente."
            )
        );
    }

    @Operation(
        summary = "Actualizar el estado activo de una reserva",
        description = "Actualiza el campo isActive de una reserva. Útil para soft-delete."
    )
    @PatchMapping("/{slug}/active")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingIsActive(
        @Parameter(description = "Slug de la reserva") @PathVariable String slug,
        @Valid @RequestBody UpdateBookingActiveRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.updateBookingIsActive(slug, request.isActive())
                ),
                request.isActive() 
                    ? "Reserva activada correctamente." 
                    : "Reserva desactivada correctamente."
            )
        );
    }

    @Operation(
        summary = "Toggle del estado activo de una reserva",
        description = "Invierte el valor actual de isActive de la reserva."
    )
    @PatchMapping("/{slug}/toggle-active")
    public ResponseEntity<ApiResponse<BookingResponse>> toggleBookingIsActive(
        @Parameter(description = "Slug de la reserva") @PathVariable String slug
    ) {
        var updatedBooking = bookingService.toggleBookingIsActive(slug);
        return ResponseEntity.ok(
            ApiResponse.success(
                bookingDtoMapper.toResponse(updatedBooking),
                updatedBooking.isActive() 
                    ? "Reserva activada correctamente." 
                    : "Reserva desactivada correctamente."
            )
        );
    }

    // ========================
    // MÉTODOS AUXILIARES PRIVADOS
    // ========================

    private ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsByType(
        BookingType type, 
        String successMessage
    ) {
        var bookings = bookingService.findBookingsByType(type)
            .stream()
            .map(bookingDtoMapper::toResponse)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(bookings, successMessage));
    }

    private ResponseEntity<ApiResponse<BookingResponse>> createBookingByType(
        CreateBookingRequest request,
        BookingType type,
        String successMessage
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.createBookingByType(request, type)
                ),
                successMessage
            )
        );
    }
}
