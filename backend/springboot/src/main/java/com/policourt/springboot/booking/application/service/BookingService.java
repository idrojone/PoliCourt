package com.policourt.springboot.booking.application.service;

import com.policourt.springboot.auth.domain.repository.UserRepository;
import com.policourt.springboot.booking.application.exception.BookingConflictException;
import com.policourt.springboot.booking.application.mapper.BookingDtoMapper;
import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.domain.repository.BookingRepository;
import com.policourt.springboot.booking.presentation.request.CreateBookingRequest;
import com.policourt.springboot.booking.presentation.request.CreateRentalRequest;
import com.policourt.springboot.booking.presentation.request.UpdateBookingRequest;
import com.policourt.springboot.booking.presentation.request.UpdateRentalRequest;
import com.policourt.springboot.court.domain.model.Court;
import com.policourt.springboot.court.domain.repository.CourtRepository;
import com.policourt.springboot.maintenance.domain.repository.MaintenanceRepository;
import com.policourt.springboot.shared.application.exception.ResourceNotFoundException;
import com.policourt.springboot.shared.utils.DateTimeUtils;
import com.policourt.springboot.shared.utils.SlugGenerator;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio que gestiona la lógica de negocio para las reservas (Bookings) y alquileres (Rentals).
 * Coordina la validación de horarios, conflictos con mantenimientos y cálculos de precios.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final SlugGenerator slugGenerator;
    private final BookingDtoMapper bookingDtoMapper;

    /**
     * Crea una reserva genérica (sin lógica especial por tipo).
     *
     * @param request DTO con los datos de la reserva.
     * @return La reserva creada.
     */
    @Transactional
    public Booking createBooking(CreateBookingRequest request) {
        return createBookingInternal(request);
    }

    /**
     * Crea una reserva de tipo específico.
     *
     * @param request DTO con los datos de la reserva.
     * @param type Tipo de reserva esperado.
     * @return La reserva creada.
     */
    @Transactional
    public Booking createBookingByType(
        CreateBookingRequest request,
        BookingType type
    ) {
        // Validar que el tipo del request coincida con el endpoint
        if (request.type() != type) {
            throw new IllegalArgumentException(
                "El tipo de reserva del request (" +
                    request.type() +
                    ") no coincide con el endpoint (" +
                    type +
                    ")."
            );
        }

        return createBookingInternal(request);
    }

    /**
     * Crea una reserva de tipo RENTAL (alquiler de pista).
     * - Genera un título aleatorio para el slug.
     * - Calcula el precio según priceH de la pista × horas reservadas.
     *
     * @param request DTO con los datos para el alquiler (pista, usuario, horario).
     * @return El objeto de dominio {@link Booking} creado y persistido.
     * @throws IllegalArgumentException si las fechas son inválidas o están en el pasado.
     * @throws ResourceNotFoundException si la pista o el organizador no existen.
     * @throws BookingConflictException si hay solapamiento con otras reservas o mantenimientos,
     *                                  o si ocurre un error de integridad en la base de datos.
     */
    @Transactional
    public Booking createRental(CreateRentalRequest request) {
        // 0. Validar que no sea en el pasado
        if (DateTimeUtils.isPast(request.startTime())) {
            throw new IllegalArgumentException(
                "La fecha de inicio no puede estar en el pasado."
            );
        }
        // 1. Validar que la fecha de fin sea posterior a la de inicio
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException(
                "La fecha de fin debe ser posterior a la fecha de inicio."
            );
        }

        // 2. Buscar entidades relacionadas
        var court = courtRepository
            .findBySlug(request.courtSlug())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Pista con slug: " + request.courtSlug() + " no encontrada."
                )
            );

        var organizer = userRepository
            .findByUsername(request.organizerUsername())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Usuario con nombre de usuario: " +
                        request.organizerUsername() +
                        " no encontrado."
                )
            );

        // 3. Comprobación de negocio: buscar superposiciones
        var overlappingBookings = bookingRepository.findByCourtIdAndDateRange(
            court.getId(),
            request.startTime(),
            request.endTime()
        );

        if (!overlappingBookings.isEmpty()) {
            throw new BookingConflictException(
                "La pista ya está reservada en el intervalo de tiempo solicitado."
            );
        }

        // 3.1 Verificar si hay mantenimiento programado
        checkForMaintenanceConflict(court.getId(), request.startTime(), request.endTime());

        // 4. Generar título aleatorio para el slug
        String randomTitle = generateRandomRentalTitle();

        // 5. Calcular precio total según duración × priceH
        BigDecimal totalPrice = calculateRentalPrice(
            court,
            request.startTime(),
            request.endTime()
        );

        // 6. Construir el objeto de dominio
        var newBooking = bookingDtoMapper.toDomain(
            request,
            court,
            organizer,
            totalPrice,
            randomTitle
        );

        // 7. Generar y establecer el Slug
        newBooking.setSlug(slugGenerator.generate(randomTitle));

        // 8. Intentar guardar
        try {
            return bookingRepository.save(newBooking);
        } catch (DataIntegrityViolationException e) {
            throw new BookingConflictException(
                "Fallo al crear la reserva debido a un conflicto de horario."
            );
        }
    }

    /**
     * Genera un título aleatorio para reservas RENTAL.
     * Formato: "rental-{UUID_corto}"
     *
     * @return Una cadena de texto que representa el título generado.
     */
    private String generateRandomRentalTitle() {
        return "rental-" + UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Calcula el precio de alquiler según la duración y el precio por hora de la pista.
     * Fórmula: (duración en minutos / 60) × priceH
     *
     * @param court La pista deportiva para obtener el precio base por hora.
     * @param startTime Fecha y hora de inicio de la reserva.
     * @param endTime Fecha y hora de fin de la reserva.
     * @return El precio total calculado con dos decimales.
     */
    private BigDecimal calculateRentalPrice(
        Court court,
        java.time.LocalDateTime startTime,
        java.time.LocalDateTime endTime
    ) {
        long durationMinutes = Duration.between(startTime, endTime).toMinutes();
        BigDecimal hours = BigDecimal.valueOf(durationMinutes).divide(
            BigDecimal.valueOf(60),
            2,
            RoundingMode.HALF_UP
        );
        return court
            .getPriceH()
            .multiply(hours)
            .setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Verifica si hay mantenimientos programados para una pista en un rango de tiempo.
     *
     * @param courtId Identificador único de la pista.
     * @param startTime Fecha y hora de inicio del rango a verificar.
     * @param endTime Fecha y hora de fin del rango a verificar.
     * @throws BookingConflictException si se encuentra al menos un mantenimiento que se solape con el rango.
     */
    private void checkForMaintenanceConflict(
        UUID courtId,
        java.time.LocalDateTime startTime,
        java.time.LocalDateTime endTime
    ) {
        var overlappingMaintenances = maintenanceRepository.findOverlappingMaintenances(
            courtId,
            startTime,
            endTime
        );

        if (!overlappingMaintenances.isEmpty()) {
            var maintenance = overlappingMaintenances.get(0);
            throw new BookingConflictException(
                "La pista tiene un mantenimiento programado ('" + 
                maintenance.getTitle() + "') desde " + 
                maintenance.getStartTime() + " hasta " + 
                maintenance.getEndTime() + ". No se puede reservar en ese horario."
            );
        }
    }

    /**
     * Lógica interna de creación de reserva.
     * Realiza las validaciones comunes de fechas, existencia de entidades,
     * disponibilidad de la pista y conflictos con mantenimientos.
     *
     * @param request DTO con los datos de la reserva.
     * @return El objeto de dominio {@link Booking} persistido.
     * @throws IllegalArgumentException si las fechas son inválidas.
     * @throws ResourceNotFoundException si la pista o el organizador no existen.
     * @throws BookingConflictException si hay solapamientos o errores de integridad.
     */
    private Booking createBookingInternal(CreateBookingRequest request) {
        // 0. Validar que no sea en el pasado
        if (DateTimeUtils.isPast(request.startTime())) {
            throw new IllegalArgumentException(
                "La fecha de inicio no puede estar en el pasado."
            );
        }
        // 1. Validar que la fecha de fin sea posterior a la de inicio
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException(
                "La fecha de fin debe ser posterior a la fecha de inicio."
            );
        }

        // 2. Buscar entidades relacionadas por slug/username
        var court = courtRepository
            .findBySlug(request.courtSlug())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Pista con slug: " + request.courtSlug() + " no encontrada."
                )
            );

        var organizer = userRepository
            .findByUsername(request.organizerUsername())
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Usuario con nombre de usuario: " +
                        request.organizerUsername() +
                        " no encontrado."
                )
            );

        // 3. Comprobación de negocio: buscar superposiciones
        var overlappingBookings = bookingRepository.findByCourtIdAndDateRange(
            court.getId(),
            request.startTime(),
            request.endTime()
        );

        if (!overlappingBookings.isEmpty()) {
            throw new BookingConflictException(
                "La pista ya está reservada en el intervalo de tiempo solicitado."
            );
        }

        // 3.1 Verificar si hay mantenimiento programado
        checkForMaintenanceConflict(court.getId(), request.startTime(), request.endTime()); 

        BigDecimal totalPrice = calculateRentalPrice(
            court,
            request.startTime(),
            request.endTime()
        );

        // 4. Construir el objeto de dominio
        var newBooking = bookingDtoMapper.toDomain(
            request,
            court,
            organizer,
            totalPrice
        );

        // 5. Generar y establecer el Slug
        String titleForSlug =
            newBooking.getTitle() != null && !newBooking.getTitle().isBlank()
                ? newBooking.getTitle()
                : "booking";
        newBooking.setSlug(slugGenerator.generate(titleForSlug));

        // 6. Intentar guardar
        try {
            return bookingRepository.save(newBooking);
        } catch (DataIntegrityViolationException e) {
            throw new BookingConflictException(
                "Fallo al crear la reserva debido a un conflicto de horario."
            );
        }
    }

    /**
     * Busca una reserva por su slug único.
     *
     * @param slug El identificador amigable de la reserva.
     * @return El objeto de dominio Booking.
     */
    @Transactional(readOnly = true)
    public Booking findBookingBySlug(String slug) {
        return bookingRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Reserva con slug " + slug + " no encontrada."
                )
            );
    }

    /**
     * Busca todas las reservas de un tipo específico.
     *
     * @param type El tipo de reserva (RENTAL, CLASS, TRAINING).
     * @return Lista de reservas encontradas.
     */
    @Transactional(readOnly = true)
    public List<Booking> findBookingsByType(BookingType type) {
        return bookingRepository.findByType(type);
    }

    /**
     * Actualiza el estado de una reserva.
     *
     * @param slug Identificador de la reserva.
     * @param newStatus Nuevo estado a aplicar.
     * @return La reserva actualizada.
     */
    @Transactional
    public Booking updateBookingStatus(String slug, BookingStatus newStatus) {
        var booking = findBookingBySlug(slug);

        // Validar transiciones de estado válidas
        validateStatusTransition(booking.getStatus(), newStatus);

        return bookingRepository.updateStatus(booking.getId(), newStatus);
    }

    /**
     * Valida que la transición de estado de una reserva sea lógica y siga las reglas de negocio.
     *
     * @param current Estado actual de la reserva.
     * @param target  Estado al que se desea transicionar.
     * @throws IllegalArgumentException si la transición no está permitida (ej. de CANCELLED a CONFIRMED)
     *                                  o si el estado actual es final (COMPLETED/CANCELLED).
     */
    private void validateStatusTransition(
        BookingStatus current,
        BookingStatus target
    ) {
        // No se puede pasar de CANCELLED o COMPLETED a otro estado
        if (
            current == BookingStatus.CANCELLED ||
            current == BookingStatus.COMPLETED
        ) {
            throw new IllegalArgumentException(
                "No se puede cambiar el estado de una reserva que ya está " +
                    current +
                    "."
            );
        }

        // PENDING solo puede ir a CONFIRMED o CANCELLED
        if (
            current == BookingStatus.PENDING &&
            target != BookingStatus.CONFIRMED &&
            target != BookingStatus.CANCELLED
        ) {
            throw new IllegalArgumentException(
                "Una reserva PENDING solo puede pasar a CONFIRMED o CANCELLED."
            );
        }

        // CONFIRMED puede ir a COMPLETED o CANCELLED
        if (
            current == BookingStatus.CONFIRMED &&
            target != BookingStatus.COMPLETED &&
            target != BookingStatus.CANCELLED
        ) {
            throw new IllegalArgumentException(
                "Una reserva CONFIRMED solo puede pasar a COMPLETED o CANCELLED."
            );
        }
    }

    /**
     * Actualiza el campo isActive de una reserva (soft-delete).
     *
     * REGLAS DE NEGOCIO:
     * - Si isActive pasa a FALSE: se liberan las horas y el status pasa a CANCELLED
     * - Si isActive pasa a TRUE: se verifica que las horas no estén ocupadas
     *   - Si están ocupadas: error
     *   - Si no están ocupadas: se activa y el status pasa a CONFIRMED
     *
     * @param slug Identificador único de la reserva.
     * @param isActive Nuevo estado de activación deseado.
     * @return La reserva con el estado actualizado.
     * @throws BookingConflictException si al reactivar hay conflictos de horario o mantenimiento.
     */
    @Transactional
    public Booking updateBookingIsActive(String slug, boolean isActive) {
        var booking = findBookingBySlug(slug);

        // Si ya tiene el valor deseado, no hacer nada
        if (booking.isActive() == isActive) {
            return booking;
        }

        if (!isActive) {
            // Desactivar: liberar horas y cancelar
            return bookingRepository.updateIsActiveAndStatus(
                booking.getId(),
                false,
                BookingStatus.CANCELLED
            );
        } else {
            // Reactivar: verificar que las horas no estén ocupadas

            var overlappingBookings =
                bookingRepository.findByCourtIdAndDateRangeExcludingBooking(
                    booking.getCourt().getId(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    booking.getId()
                );

            if (!overlappingBookings.isEmpty()) {
                throw new BookingConflictException(
                    "No se puede reactivar la reserva. Las horas ya fueron reservadas por otra persona."
                );
            }

            // Verificar si hay mantenimiento programado en las horas de la reserva
            checkForMaintenanceConflict(
                booking.getCourt().getId(),
                booking.getStartTime(),
                booking.getEndTime()
            );

            return bookingRepository.updateIsActiveAndStatus(
                booking.getId(),
                true,
                BookingStatus.CONFIRMED
            );
        }
    }

    /**
     * Toggle del campo isActive de una reserva.
     * Aplica las mismas reglas de negocio que updateBookingIsActive.
     *
     * @param slug Identificador único de la reserva.
     * @return La reserva con el estado de activación invertido.
     * @throws BookingConflictException si al reactivar hay conflictos de horario o mantenimiento.
     */
    @Transactional
    public Booking toggleBookingIsActive(String slug) {
        var booking = findBookingBySlug(slug);
        boolean newIsActive = !booking.isActive();
        return updateBookingIsActive(slug, newIsActive);
    }

    // ========================
    // MÉTODOS DE ACTUALIZACIÓN
    // ========================

    /**
     * Actualiza una reserva de tipo CLASS o TRAINING.
     *
     * REGLAS DE NEGOCIO:
     * - NO se puede cambiar: courtSlug, organizerUsername, type
     * - Si cambia el título: se regenera el slug
     * - Si cambian las horas: se verifica disponibilidad y se recalcula precio
     *
     * @param slug Identificador de la reserva a actualizar.
     * @param request DTO con los nuevos datos.
     * @return La reserva actualizada.
     */
    @Transactional
    public Booking updateBooking(String slug, UpdateBookingRequest request) {
        var booking = findBookingBySlug(slug);

        // Validar que no sea un RENTAL (usar updateRental para eso)
        if (booking.getType() == BookingType.RENTAL) {
            throw new IllegalArgumentException(
                "Para actualizar un alquiler, use el endpoint específico de rentals."
            );
        }

        // Validar que la fecha de fin sea posterior a la de inicio
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException(
                "La fecha de fin debe ser posterior a la fecha de inicio."
            );
        }

        // Verificar si cambiaron las horas
        boolean hoursChanged =
            !booking.getStartTime().equals(request.startTime()) ||
            !booking.getEndTime().equals(request.endTime());

        if (hoursChanged) {
            if (DateTimeUtils.isPast(request.startTime())) {
                throw new IllegalArgumentException(
                    "La fecha de inicio no puede estar en el pasado."
                );
            }

            // Verificar disponibilidad excluyendo el booking actual
            var overlappingBookings =
                bookingRepository.findByCourtIdAndDateRangeExcludingBooking(
                    booking.getCourt().getId(),
                    request.startTime(),
                    request.endTime(),
                    booking.getId()
                );

            if (!overlappingBookings.isEmpty()) {
                throw new BookingConflictException(
                    "La pista ya está reservada en el nuevo intervalo de tiempo solicitado."
                );
            }

            // Verificar si hay mantenimiento programado en las nuevas horas
            checkForMaintenanceConflict(
                booking.getCourt().getId(),
                request.startTime(),
                request.endTime()
            );

            booking.setStartTime(request.startTime());
            booking.setEndTime(request.endTime());

            // Recalcular precio si aplica (CLASS y TRAINING normalmente no tienen precio por hora)
            // pero mantenemos la lógica por si se extiende en el futuro
            BigDecimal newPrice = calculateRentalPrice(
                booking.getCourt(),
                request.startTime(),
                request.endTime()
            );
            booking.setTotalPrice(newPrice);
        }

        // Verificar si cambió el título
        String newTitle = request.title() != null ? request.title().trim() : "";
        String currentTitle =
            booking.getTitle() != null ? booking.getTitle() : "";

        if (!newTitle.equals(currentTitle) && !newTitle.isBlank()) {
            booking.setTitle(newTitle);
            // Regenerar slug si cambió el título
            booking.setSlug(slugGenerator.generate(newTitle));
        }

        // Actualizar descripción y precio por asistente
        booking.setDescription(request.description());
        booking.setAttendeePrice(request.attendeePrice());

        try {
            return bookingRepository.update(booking);
        } catch (DataIntegrityViolationException e) {
            throw new BookingConflictException(
                "Fallo al actualizar la reserva debido a un conflicto."
            );
        }
    }

    /**
     * Actualiza una reserva de tipo RENTAL.
     *
     * REGLAS DE NEGOCIO:
     * - NO se puede cambiar: courtSlug, organizerUsername
     * - Si cambian las horas: se verifica disponibilidad y se recalcula precio
     * - El título no se puede cambiar (es auto-generado)
     *
     * @param slug Identificador del alquiler a actualizar.
     * @param request DTO con los nuevos datos de horario.
     * @return El alquiler actualizado.
     */
    @Transactional
    public Booking updateRental(String slug, UpdateRentalRequest request) {
        var booking = findBookingBySlug(slug);

        // Validar que sea un RENTAL
        if (booking.getType() != BookingType.RENTAL) {
            throw new IllegalArgumentException(
                "Este endpoint solo permite actualizar reservas de tipo RENTAL."
            );
        }

        // Validar que la fecha de fin sea posterior a la de inicio
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException(
                "La fecha de fin debe ser posterior a la fecha de inicio."
            );
        }

        // Verificar si cambiaron las horas
        boolean hoursChanged =
            !booking.getStartTime().equals(request.startTime()) ||
            !booking.getEndTime().equals(request.endTime());

        if (hoursChanged) {
            if (DateTimeUtils.isPast(request.startTime())) {
                throw new IllegalArgumentException(
                    "La fecha de inicio no puede estar en el pasado."
                );
            }

            // Verificar disponibilidad excluyendo el booking actual
            var overlappingBookings =
                bookingRepository.findByCourtIdAndDateRangeExcludingBooking(
                    booking.getCourt().getId(),
                    request.startTime(),
                    request.endTime(),
                    booking.getId()
                );

            if (!overlappingBookings.isEmpty()) {
                throw new BookingConflictException(
                    "La pista ya está reservada en el nuevo intervalo de tiempo solicitado."
                );
            }

            // Verificar si hay mantenimiento programado en las nuevas horas
            checkForMaintenanceConflict(
                booking.getCourt().getId(),
                request.startTime(),
                request.endTime()
            );

            booking.setStartTime(request.startTime());
            booking.setEndTime(request.endTime());

            // Recalcular precio según nuevas horas
            BigDecimal newPrice = calculateRentalPrice(
                booking.getCourt(),
                request.startTime(),
                request.endTime()
            );
            booking.setTotalPrice(newPrice);

        }

        try {
            return bookingRepository.update(booking);
        } catch (DataIntegrityViolationException e) {
            throw new BookingConflictException(
                "Fallo al actualizar el alquiler debido a un conflicto."
            );
        }
    }
}
