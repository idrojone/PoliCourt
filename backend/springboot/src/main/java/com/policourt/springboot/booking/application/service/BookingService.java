package com.policourt.springboot.booking.application.service;

import com.policourt.springboot.auth.domain.repository.UserRepository;
import com.policourt.springboot.booking.application.exception.BookingConflictException;
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
import com.policourt.springboot.shared.application.exception.ResourceNotFoundException;
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

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;
    private final SlugGenerator slugGenerator;

    /**
     * Crea una reserva genérica (sin lógica especial por tipo).
     */
    @Transactional
    public Booking createBooking(CreateBookingRequest request) {
        return createBookingInternal(request);
    }

    /**
     * Crea una reserva de tipo específico.
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
     */
    @Transactional
    public Booking createRental(CreateRentalRequest request) {
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

        // 4. Generar título aleatorio para el slug
        String randomTitle = generateRandomRentalTitle();

        // 5. Calcular precio total según duración × priceH
        BigDecimal totalPrice = calculateRentalPrice(
            court,
            request.startTime(),
            request.endTime()
        );

        // 6. Construir el objeto de dominio
        var newBooking = Booking.builder()
            .court(court)
            .organizer(organizer)
            .type(BookingType.RENTAL)
            .title(randomTitle)
            .description(null)
            .startTime(request.startTime())
            .endTime(request.endTime())
            .totalPrice(totalPrice)
            .status(BookingStatus.CONFIRMED)
            .build();

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
     */
    private String generateRandomRentalTitle() {
        return "rental-" + UUID.randomUUID().toString().substring(0, 8);
    }

    /**
     * Calcula el precio de alquiler según la duración y el precio por hora de la pista.
     * Fórmula: (duración en minutos / 60) × priceH
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
     * Lógica interna de creación de reserva.
     */
    private Booking createBookingInternal(CreateBookingRequest request) {
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

        // 4. Construir el objeto de dominio
        var newBooking = Booking.builder()
            .court(court)
            .organizer(organizer)
            .type(request.type())
            .title(request.title())
            .description(request.description())
            .startTime(request.startTime())
            .endTime(request.endTime())
            .totalPrice(
                calculateRentalPrice(
                    court,
                    request.startTime(),
                    request.endTime()
                )
            )
            .attendeePrice(request.attendeePrice())
            .status(BookingStatus.CONFIRMED)
            .build();

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
     */
    @Transactional(readOnly = true)
    public List<Booking> findBookingsByType(BookingType type) {
        return bookingRepository.findByType(type);
    }

    /**
     * Actualiza el estado de una reserva.
     */
    @Transactional
    public Booking updateBookingStatus(String slug, BookingStatus newStatus) {
        var booking = findBookingBySlug(slug);

        // Validar transiciones de estado válidas
        validateStatusTransition(booking.getStatus(), newStatus);

        return bookingRepository.updateStatus(booking.getId(), newStatus);
    }

    /**
     * Valida que la transición de estado sea lógica.
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
