package com.policourt.springboot.booking.presentation.controller;

import com.policourt.springboot.booking.application.mapper.BookingDtoMapper;
import com.policourt.springboot.booking.application.service.BookingService;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.presentation.request.CreateBookingRequest;
import com.policourt.springboot.booking.presentation.request.CreateRentalRequest;
import com.policourt.springboot.booking.presentation.request.UpdateBookingActiveRequest;
import com.policourt.springboot.booking.presentation.request.UpdateBookingRequest;
import com.policourt.springboot.booking.presentation.request.UpdateBookingStatusRequest;
import com.policourt.springboot.booking.presentation.request.UpdateRentalRequest;
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
        description = "Crea una nueva reserva de tipo RENTAL. El título se genera automáticamente y el precio se calcula según el tiempo reservado × precio por hora de la pista."
    )
    @PostMapping("/rentals")
    public ResponseEntity<ApiResponse<BookingResponse>> createRental(
        @Valid @RequestBody CreateRentalRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.createRental(request)
                ),
                "Alquiler creado con éxito."
            )
        );
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
    // ENDPOINTS DE ACTUALIZACIÓN (PUT)
    // ========================

    @Operation(
        summary = "Actualizar un alquiler",
        description = """
            Actualiza una reserva de tipo RENTAL. 
            Solo se pueden modificar las horas (startTime, endTime).
            El precio se recalcula automáticamente según el nuevo horario.
            NO se puede cambiar: la pista ni el usuario organizador.
        """
    )
    @PutMapping("/rentals/{slug}")
    public ResponseEntity<ApiResponse<BookingResponse>> updateRental(
        @Parameter(description = "Slug del alquiler") @PathVariable String slug,
        @Valid @RequestBody UpdateRentalRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.updateRental(slug, request)
                ),
                "Alquiler actualizado correctamente."
            )
        );
    }

    @Operation(
        summary = "Actualizar una clase",
        description = """
            Actualiza una reserva de tipo CLASS.
            Se pueden modificar: título, descripción, startTime, endTime.
            Si cambia el título, se regenera el slug.
            Si cambian las horas, se verifica disponibilidad y se recalcula el precio.
            NO se puede cambiar: la pista ni el usuario organizador.
        """
    )
    @PutMapping("/classes/{slug}")
    public ResponseEntity<ApiResponse<BookingResponse>> updateClass(
        @Parameter(description = "Slug de la clase") @PathVariable String slug,
        @Valid @RequestBody UpdateBookingRequest request
    ) {
        var booking = bookingService.findBookingBySlug(slug);
        if (booking.getType() != BookingType.CLASS) {
            throw new IllegalArgumentException(
                "La reserva con slug '" + slug + "' no es de tipo CLASS."
            );
        }
        return ResponseEntity.ok(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.updateBooking(slug, request)
                ),
                "Clase actualizada correctamente."
            )
        );
    }

    @Operation(
        summary = "Actualizar un entrenamiento",
        description = """
            Actualiza una reserva de tipo TRAINING.
            Se pueden modificar: título, descripción, startTime, endTime.
            Si cambia el título, se regenera el slug.
            Si cambian las horas, se verifica disponibilidad y se recalcula el precio.
            NO se puede cambiar: la pista ni el usuario organizador.
        """
    )
    @PutMapping("/trainings/{slug}")
    public ResponseEntity<ApiResponse<BookingResponse>> updateTraining(
        @Parameter(description = "Slug del entrenamiento") @PathVariable String slug,
        @Valid @RequestBody UpdateBookingRequest request
    ) {
        var booking = bookingService.findBookingBySlug(slug);
        if (booking.getType() != BookingType.TRAINING) {
            throw new IllegalArgumentException(
                "La reserva con slug '" + slug + "' no es de tipo TRAINING."
            );
        }
        return ResponseEntity.ok(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.updateBooking(slug, request)
                ),
                "Entrenamiento actualizado correctamente."
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
