package com.policourt.springboot.booking.domain.repository;

import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository {
    Booking save(Booking booking);

    Optional<Booking> findBySlug(String slug);

    List<Booking> findByCourtIdAndDateRange(
        UUID courtId,
        LocalDateTime startTime,
        LocalDateTime endTime
    );

    List<Booking> findByOrganizerId(UUID organizerId);

    /**
     * Busca todas las reservas de un tipo específico.
     */
    List<Booking> findByType(BookingType type);

    /**
     * Actualiza el estado de una reserva.
     */
    Booking updateStatus(UUID bookingId, BookingStatus newStatus);

    /**
     * Cancela todas las reservas activas en un rango de tiempo para una cancha.
     * Útil cuando se programa un mantenimiento.
     * @return cantidad de reservas canceladas
     */
    int cancelBookingsInRange(UUID courtId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * Busca una reserva por su ID.
     */
    Optional<Booking> findById(UUID id);

    /**
     * Actualiza el campo isActive de una reserva (soft-delete toggle).
     */
    Booking updateIsActive(UUID bookingId, boolean isActive);
}
