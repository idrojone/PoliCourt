package com.policourt.springboot.booking.application.service;

import com.policourt.springboot.auth.domain.repository.UserRepository;
import com.policourt.springboot.booking.application.exception.BookingConflictException;
import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.domain.repository.BookingRepository;
import com.policourt.springboot.booking.presentation.request.CreateBookingRequest;
import com.policourt.springboot.court.domain.repository.CourtRepository;
import com.policourt.springboot.shared.application.exception.ResourceNotFoundException;
import com.policourt.springboot.shared.utils.SlugGenerator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
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
        return createBookingInternal(request, false);
    }

    /**
     * Crea una reserva de tipo específico.
     * Si es MAINTENANCE, cancela las reservas existentes en ese rango.
     */
    @Transactional
    public Booking createBookingByType(CreateBookingRequest request, BookingType type) {
        // Validar que el tipo del request coincida con el endpoint
        if (request.type() != type) {
            throw new IllegalArgumentException(
                "El tipo de reserva del request (" + request.type() + 
                ") no coincide con el endpoint (" + type + ")."
            );
        }

        // Si es MAINTENANCE, forzamos la cancelación de reservas superpuestas
        boolean forceCancel = (type == BookingType.MAINTENANCE);
        return createBookingInternal(request, forceCancel);
    }

    /**
     * Lógica interna de creación de reserva.
     * @param forceCancel si es true, cancela las reservas existentes en lugar de lanzar excepción
     */
    private Booking createBookingInternal(CreateBookingRequest request, boolean forceCancel) {
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
            if (forceCancel) {
                // Si es mantenimiento, cancelamos las reservas superpuestas
                int cancelled = bookingRepository.cancelBookingsInRange(
                    court.getId(),
                    request.startTime(),
                    request.endTime()
                );
                log.info("Se cancelaron {} reservas debido a mantenimiento programado.", cancelled);
            } else {
                throw new BookingConflictException(
                    "La pista ya está reservada en el intervalo de tiempo solicitado."
                );
            }
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
    private void validateStatusTransition(BookingStatus current, BookingStatus target) {
        // No se puede pasar de CANCELLED o COMPLETED a otro estado
        if (current == BookingStatus.CANCELLED || current == BookingStatus.COMPLETED) {
            throw new IllegalArgumentException(
                "No se puede cambiar el estado de una reserva que ya está " + current + "."
            );
        }
        
        // PENDING solo puede ir a CONFIRMED o CANCELLED
        if (current == BookingStatus.PENDING && 
            target != BookingStatus.CONFIRMED && 
            target != BookingStatus.CANCELLED) {
            throw new IllegalArgumentException(
                "Una reserva PENDING solo puede pasar a CONFIRMED o CANCELLED."
            );
        }
        
        // CONFIRMED puede ir a COMPLETED o CANCELLED
        if (current == BookingStatus.CONFIRMED && 
            target != BookingStatus.COMPLETED && 
            target != BookingStatus.CANCELLED) {
            throw new IllegalArgumentException(
                "Una reserva CONFIRMED solo puede pasar a COMPLETED o CANCELLED."
            );
        }
    }

    /**
     * Actualiza el campo isActive de una reserva (soft-delete).
     */
    @Transactional
    public Booking updateBookingIsActive(String slug, boolean isActive) {
        var booking = findBookingBySlug(slug);
        return bookingRepository.updateIsActive(booking.getId(), isActive);
    }

    /**
     * Toggle del campo isActive de una reserva.
     */
    @Transactional
    public Booking toggleBookingIsActive(String slug) {
        var booking = findBookingBySlug(slug);
        boolean newIsActive = !booking.isActive();
        return bookingRepository.updateIsActive(booking.getId(), newIsActive);
    }
}
