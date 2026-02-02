package com.policourt.springboot.booking.infrastructure.specifications;

import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.infrastructure.entity.BookingEntity;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Clase que contiene las especificaciones para consultas JPA de reservas.
 */
public class BookingSpecification {

    /**
     * Especificación para buscar por ID de pista.
     */
    public static Specification<BookingEntity> hasCourtId(UUID courtId) {
        return (root, query, cb) -> cb.equal(root.get("court").get("id"), courtId);
    }

    /**
     * Especificación para excluir reservas canceladas.
     */
    public static Specification<BookingEntity> isNotCancelled() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), BookingStatus.CANCELLED);
    }

    /**
     * Especificación para buscar solo reservas activas (borrado lógico).
     */
    public static Specification<BookingEntity> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("isActive"));
    }

    /**
     * Especificación para reservas que se superponen en tiempo.
     * <p>
     * Lógica de solapamiento: (startTime < end) AND (endTime > start)
     * </p>
     *
     * @param start Fecha y hora de inicio del rango.
     * @param end   Fecha y hora de fin del rango.
     * @return Especificación de solapamiento.
     */
    public static Specification<BookingEntity> overlaps(LocalDateTime start, LocalDateTime end) {
        return (root, query, cb) -> cb.and(
            cb.lessThan(root.get("startTime"), end),
            cb.greaterThan(root.get("endTime"), start)
        );
    }

    /**
     * Especificación para excluir una reserva específica por ID.
     */
    public static Specification<BookingEntity> excludeId(UUID id) {
        return (root, query, cb) -> id == null ? cb.conjunction() : cb.notEqual(root.get("id"), id);
    }

    /**
     * Especificación para buscar reservas solapadas válidas (no canceladas y activas) para una pista.
     *
     * @param courtId ID de la pista.
     * @param start   Fecha y hora de inicio.
     * @param end     Fecha y hora de fin.
     * @return Especificación combinada para solapamientos.
     */
    public static Specification<BookingEntity> overlappingBookings(UUID courtId, LocalDateTime start, LocalDateTime end) {
        return Specification.where(hasCourtId(courtId))
            .and(isNotCancelled())
            .and(isActive())
            .and(overlaps(start, end));
    }

    /**
     * Especificación para buscar reservas solapadas excluyendo una específica.
     * Útil para validaciones durante la actualización de una reserva existente.
     *
     * @param courtId   ID de la pista.
     * @param start     Fecha y hora de inicio.
     * @param end       Fecha y hora de fin.
     * @param excludeId ID de la reserva a excluir.
     * @return Especificación combinada excluyendo el ID proporcionado.
     */
    public static Specification<BookingEntity> overlappingBookingsExcluding(UUID courtId, LocalDateTime start, LocalDateTime end, UUID excludeId) {
        return overlappingBookings(courtId, start, end).and(excludeId(excludeId));
    }
}