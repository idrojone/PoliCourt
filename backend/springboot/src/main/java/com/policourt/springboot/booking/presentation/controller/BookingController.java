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
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para la gestión de reservas (alquileres, clases y entrenamientos).
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Endpoints para la gestión de reservas")
@Slf4j
public class BookingController {

    private final BookingService bookingService;
    private final BookingDtoMapper bookingDtoMapper;

    // ========================
    // ENDPOINTS GENERALES
    // ========================

    /**
     * Crea una nueva reserva genérica.
     *
     * @param request Datos para la creación de la reserva.
     * @return Respuesta con la reserva creada.
     */
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

    /**
     * Busca una reserva por su identificador amigable (slug).
     *
     * @param slug El slug de la reserva.
     * @return Respuesta con los detalles de la reserva.
     */
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

    /**
     * Obtiene el listado de todos los alquileres.
     *
     * @return Lista de reservas de tipo RENTAL.
     */
    @Operation(
        summary = "Obtener todas las reservas de alquiler",
        description = "Recupera todas las reservas de tipo RENTAL."
    )
    @GetMapping("/rentals")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getRentals() {
        return getBookingsByType(
            BookingType.RENTAL,
            "Alquileres recuperados correctamente."
        );
    }

    /**
     * Crea una reserva de tipo alquiler.
     *
     * @param request Datos específicos para el alquiler.
     * @return Respuesta con el alquiler creado.
     */
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

    /**
     * Obtiene el listado de todas las clases.
     *
     * @return Lista de reservas de tipo CLASS.
     */
    @Operation(
        summary = "Obtener todas las clases",
        description = "Recupera todas las reservas de tipo CLASS."
    )
    @GetMapping("/classes")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getClasses() {
        return getBookingsByType(
            BookingType.CLASS,
            "Clases recuperadas correctamente."
        );
    }

    /**
     * Crea una reserva de tipo clase.
     *
     * @param request Datos para la creación de la clase.
     * @return Respuesta con la clase creada.
     */
    @Operation(
        summary = "Crear una clase",
        description = "Crea una nueva reserva de tipo CLASS."
    )
    @PostMapping("/classes")
    public ResponseEntity<ApiResponse<BookingResponse>> createClass(
        @Valid @RequestBody CreateBookingRequest request
    ) {
        return createBookingByType(
            request,
            BookingType.CLASS,
            "Clase creada con éxito."
        );
    }

    /**
     * Obtiene el listado de todos los entrenamientos.
     *
     * @return Lista de reservas de tipo TRAINING.
     */
    @Operation(
        summary = "Obtener todos los entrenamientos",
        description = "Recupera todas las reservas de tipo TRAINING."
    )
    @GetMapping("/trainings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getTrainings() {
        return getBookingsByType(
            BookingType.TRAINING,
            "Entrenamientos recuperados correctamente."
        );
    }

    /**
     * Crea una reserva de tipo entrenamiento.
     *
     * @param request Datos para la creación del entrenamiento.
     * @return Respuesta con el entrenamiento creado.
     */
    @Operation(
        summary = "Crear un entrenamiento",
        description = "Crea una nueva reserva de tipo TRAINING."
    )
    @PostMapping("/trainings")
    public ResponseEntity<ApiResponse<BookingResponse>> createTraining(
        @Valid @RequestBody CreateBookingRequest request
    ) {
        return createBookingByType(
            request,
            BookingType.TRAINING,
            "Entrenamiento creado con éxito."
        );
    }

    // ========================
    // ENDPOINTS DE ACTUALIZACIÓN
    // ========================

    /**
     * Actualiza el estado de una reserva existente.
     *
     * @param slug    Slug de la reserva a actualizar.
     * @param request Nuevo estado de la reserva.
     * @return Respuesta con la reserva actualizada.
     */
    @Operation(
        summary = "Actualizar el estado de una reserva",
        description = "Actualiza el estado (CONFIRMED, PENDING, CANCELLED, COMPLETED) de una reserva específica."
    )
    @PatchMapping("/{slug}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
        @Parameter(
            description = "Slug de la reserva"
        ) @PathVariable String slug,
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

    /**
     * Actualiza la visibilidad o estado activo de una reserva.
     *
     * @param slug    Slug de la reserva.
     * @param request Nuevo valor de activación.
     * @return Respuesta con la reserva actualizada.
     */
    @Operation(
        summary = "Actualizar el estado activo de una reserva",
        description = "Actualiza el campo isActive de una reserva. Útil para soft-delete."
    )
    @PatchMapping("/{slug}/active")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingIsActive(
        @Parameter(
            description = "Slug de la reserva"
        ) @PathVariable String slug,
        @Valid @RequestBody UpdateBookingActiveRequest request
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(
                bookingDtoMapper.toResponse(
                    bookingService.updateBookingIsActive(
                        slug,
                        request.isActive()
                    )
                ),
                request.isActive()
                    ? "Reserva activada correctamente."
                    : "Reserva desactivada correctamente."
            )
        );
    }

    /**
     * Alterna el estado activo de una reserva (de true a false o viceversa).
     *
     * @param slug Slug de la reserva.
     * @return Respuesta con la reserva y su nuevo estado.
     */
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

    /**
     * Actualiza los datos de un alquiler.
     *
     * @param slug    Slug del alquiler.
     * @param request Datos de actualización (horarios).
     * @return Respuesta con el alquiler actualizado.
     */
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

    /**
     * Actualiza los datos de una clase.
     *
     * @param slug    Slug de la clase.
     * @param request Datos de actualización.
     * @return Respuesta con la clase actualizada.
     */
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

    /**
     * Actualiza los datos de un entrenamiento.
     *
     * @param slug    Slug del entrenamiento.
     * @param request Datos de actualización.
     * @return Respuesta con el entrenamiento actualizado.
     */
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
        @Parameter(
            description = "Slug del entrenamiento"
        ) @PathVariable String slug,
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

    /**
     * Método auxiliar para recuperar reservas filtradas por tipo.
     *
     * @param type           Tipo de reserva.
     * @param successMessage Mensaje de éxito para la respuesta.
     * @return ResponseEntity con la lista de reservas.
     */
    private ResponseEntity<
        ApiResponse<List<BookingResponse>>
    > getBookingsByType(BookingType type, String successMessage) {
        var bookings = bookingService
            .findBookingsByType(type)
            .stream()
            .map(bookingDtoMapper::toResponse)
            .toList();
        return ResponseEntity.ok(ApiResponse.success(bookings, successMessage));
    }

    /**
     * Método auxiliar para crear reservas de un tipo específico.
     *
     * @param request        Datos de la reserva.
     * @param type           Tipo de reserva a crear.
     * @param successMessage Mensaje de éxito para la respuesta.
     * @return ResponseEntity con la reserva creada.
     */
    private ResponseEntity<ApiResponse<BookingResponse>> createBookingByType(
        CreateBookingRequest request,
        BookingType type,
        String successMessage
    ) {
        log.info(
            "Attempting to create a booking of type '{}' with request: {}",
            type,
            request
        );

        var createdBooking = bookingService.createBookingByType(request, type);

        log.info(
            "Successfully created booking of type '{}' with slug '{}'",
            type,
            createdBooking.getSlug()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(
                bookingDtoMapper.toResponse(createdBooking),
                successMessage
            )
        );
    }
}
