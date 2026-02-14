package com.policourt.springboot.booking.domain.repository;

import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;

public interface BookingRepository {
        /**
         * Guarda una reserva en el sistema.
         *
         * @param booking El objeto de dominio a persistir.
         * @return La reserva guardada.
         */
        Booking save(Booking booking);

        /**
         * Busca una reserva por su identificador amigable (slug).
         *
         * @param slug El slug de la reserva.
         * @return Un Optional con la reserva si se encuentra.
         */
        Optional<Booking> findBySlug(String slug);

        /**
         * Busca reservas activas que se superponen con un rango de tiempo para una
         * pista específica.
         *
         * @param courtId   Identificador de la pista.
         * @param startTime Fecha y hora de inicio del rango.
         * @param endTime   Fecha y hora de fin del rango.
         * @return Lista de reservas que presentan conflicto de horario.
         */
        List<Booking> findByCourtIdAndDateRange(
                        UUID courtId,
                        LocalDateTime startTime,
                        LocalDateTime endTime);

        /**
         * Busca reservas que se superponen con un rango de tiempo, excluyendo un
         * booking específico.
         * Útil para validar actualizaciones de horario sin contar el booking actual.
         *
         * @param courtId          Identificador de la pista.
         * @param startTime        Fecha y hora de inicio.
         * @param endTime          Fecha y hora de fin.
         * @param excludeBookingId ID de la reserva a excluir de la búsqueda.
         * @return Lista de reservas en conflicto.
         */
        List<Booking> findByCourtIdAndDateRangeExcludingBooking(
                        UUID courtId,
                        LocalDateTime startTime,
                        LocalDateTime endTime,
                        UUID excludeBookingId);

        /**
         * Busca todas las reservas organizadas por un usuario específico.
         *
         * @param organizerId Identificador del usuario organizador.
         * @return Lista de reservas del usuario.
         */
        List<Booking> findByOrganizerId(UUID organizerId);

        /**
         * Busca todas las reservas de un tipo específico.
         *
         * @param type Tipo de reserva (RENTAL, CLASS, TRAINING).
         * @return Lista de reservas filtradas por tipo.
         */
        List<Booking> findByType(BookingType type);

        /**
         * Actualiza el estado de una reserva.
         *
         * @param bookingId Identificador de la reserva.
         * @param newStatus Nuevo estado a aplicar.
         * @return La reserva actualizada.
         */
        Booking updateStatus(UUID bookingId, BookingStatus newStatus);

        /**
         * Cancela todas las reservas activas en un rango de tiempo para una cancha.
         * Útil cuando se programa un mantenimiento.
         *
         * @param courtId   Identificador de la pista.
         * @param startTime Inicio del rango de cancelación.
         * @param endTime   Fin del rango de cancelación.
         * @return Cantidad de reservas que han sido canceladas.
         */
        int cancelBookingsInRange(UUID courtId, LocalDateTime startTime, LocalDateTime endTime);

        /**
         * Busca una reserva por su ID.
         *
         * @param id Identificador único de la reserva.
         * @return Un Optional con la reserva encontrada.
         */
        Optional<Booking> findById(UUID id);

        /**
         * Actualiza el campo isActive de una reserva (soft-delete toggle).
         *
         * @param bookingId Identificador de la reserva.
         * @param isActive  Nuevo estado de activación.
         * @return La reserva actualizada.
         */
        Booking updateIsActive(UUID bookingId, boolean isActive);

        /**
         * Actualiza una reserva completa.
         *
         * @param booking Objeto de dominio con los datos actualizados.
         * @return La reserva persistida.
         */
        Booking update(Booking booking);

        /**
         * Actualiza isActive y status de una reserva en una sola operación.
         *
         * @param bookingId Identificador de la reserva.
         * @param isActive  Nuevo estado de activación.
         * @param status    Nuevo estado de la reserva.
         * @return La reserva actualizada.
         */
        Booking updateIsActiveAndStatus(UUID bookingId, boolean isActive, BookingStatus status);

        /**
         * Búsqueda paginada y filtrada de reservas por tipo usando Specifications.
         *
         * @param type        Tipo de reserva (forzado por endpoint).
         * @param courtId     ID de la pista (opcional).
         * @param organizerId ID del organizador (opcional).
         * @param status      Estado de la reserva (opcional).
         * @param isActive    Activo/inactivo (opcional).
         * @param startTime   Desde fecha (opcional).
         * @param endTime     Hasta fecha (opcional).
         * @param minPrice    Precio mínimo (opcional).
         * @param maxPrice    Precio máximo (opcional).
         * @param q           Búsqueda por título/descripción (opcional).
         * @param pageable    Paginación y orden.
         * @return Página de reservas filtradas.
         */
        Page<Booking> searchByType(
                        BookingType type,
                        UUID courtId,
                        UUID organizerId,
                        BookingStatus status,
                        Boolean isActive,
                        LocalDateTime startTime,
                        LocalDateTime endTime,
                        BigDecimal minPrice,
                        BigDecimal maxPrice,
                        String q,
                        @NonNull Pageable pageable);
}
