package com.policourt.springboot.booking.infrastructure.specifications;

import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.infrastructure.entity.BookingEntity;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
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
                cb.greaterThan(root.get("endTime"), start));
    }

    /**
     * Especificación para excluir una reserva específica por ID.
     */
    public static Specification<BookingEntity> excludeId(UUID id) {
        return (root, query, cb) -> id == null ? cb.conjunction() : cb.notEqual(root.get("id"), id);
    }

    /**
     * Especificación para buscar reservas solapadas válidas (no canceladas y
     * activas) para una pista.
     *
     * @param courtId ID de la pista.
     * @param start   Fecha y hora de inicio.
     * @param end     Fecha y hora de fin.
     * @return Especificación combinada para solapamientos.
     */
    public static Specification<BookingEntity> overlappingBookings(UUID courtId, LocalDateTime start,
            LocalDateTime end) {
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
    public static Specification<BookingEntity> overlappingBookingsExcluding(UUID courtId, LocalDateTime start,
            LocalDateTime end, UUID excludeId) {
        return overlappingBookings(courtId, start, end).and(excludeId(excludeId));
    }

    /**
     * Especificación para filtrar por tipo.
     */
    public static Specification<BookingEntity> hasType(BookingType type) {
        return (root, query, cb) -> type == null ? cb.conjunction() : cb.equal(root.get("type"), type);
    }

    /**
     * Especificación para filtrar por estado.
     */
    public static Specification<BookingEntity> hasStatus(BookingStatus status) {
        return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    /**
     * Especificación para filtrar por estado de actividad (borrado lógico).
     */
    public static Specification<BookingEntity> filterByActive(Boolean isActive) {
        return (root, query, cb) -> isActive == null ? cb.conjunction() : cb.equal(root.get("isActive"), isActive);
    }

    /**
     * Especificación para filtrar por rango de fechas (intersección).
     */
    public static Specification<BookingEntity> inDateRange(LocalDateTime start, LocalDateTime end) {
        return (root, query, cb) -> {
            boolean hasStart = start != null;
            boolean hasEnd = end != null;

            if (!hasStart && !hasEnd)
                return cb.conjunction();

            // Predicado para solapamiento: (StartA < EndB) && (EndA > StartB)
            if (hasStart && hasEnd) {
                return cb.and(
                        cb.lessThan(root.get("startTime"), end),
                        cb.greaterThan(root.get("endTime"), start));
            }
            // Si solo hay inicio, booking termina después del inicio param
            if (hasStart)
                return cb.greaterThan(root.get("endTime"), start);

            // Si solo hay fin, booking empieza antes del fin param
            return cb.lessThan(root.get("startTime"), end);
        };
    }

    /**
     * Helper para combinar filtros comunes.
     */
    private static Specification<BookingEntity> withBaseFilters(
            UUID courtId,
            BookingStatus status,
            Boolean isActive,
            LocalDateTime start,
            LocalDateTime end) {
        return Specification.where(courtId != null ? hasCourtId(courtId) : null)
                .and(filterByActive(isActive))
                .and(hasStatus(status))
                .and(inDateRange(start, end));
    }

    /**
     * Especificación para filtrar reservas de tipo RENTAL (Alquiler).
     */
    public static Specification<BookingEntity> filterRentals(
            UUID courtId,
            BookingStatus status,
            Boolean isActive,
            LocalDateTime start,
            LocalDateTime end) {
        return withBaseFilters(courtId, status, isActive, start, end)
                .and(hasType(BookingType.RENTAL));
    }

    /**
     * Especificación para filtrar reservas de tipo CLASS (Clases).
     */
    public static Specification<BookingEntity> filterClasses(
            UUID courtId,
            BookingStatus status,
            Boolean isActive,
            LocalDateTime start,
            LocalDateTime end) {
        return withBaseFilters(courtId, status, isActive, start, end)
                .and(hasType(BookingType.CLASS));
    }

    /**
     * Especificación para filtrar reservas de tipo TRAINING (Entrenamientos).
     */
    public static Specification<BookingEntity> filterTrainings(
            UUID courtId,
            BookingStatus status,
            Boolean isActive,
            LocalDateTime start,
            LocalDateTime end) {
        return withBaseFilters(courtId, status, isActive, start, end)
                .and(hasType(BookingType.TRAINING));
    }

    /**
     * Especificación básica para búsqueda por texto (título o descripción).
     */
    public static Specification<BookingEntity> searchByQEntity(String q) {
        return (root, cq, cb) -> {
            if (q == null || q.isBlank())
                return cb.conjunction();
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("description")), like));
        };
    }

    /**
     * Especificación maestra que engloba todos los filtros posibles para
     * BookingEntity.
     * Sigue el patrón de SportSpecifications y CourtSpecifications.
     */
    public static Specification<BookingEntity> filteredByAtributosEntity(
            UUID courtId,
            UUID organizerId,
            Collection<BookingType> types,
            Collection<BookingStatus> statuses,
            Boolean isActive,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String title) {
        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (courtId != null) {
                predicates.add(cb.equal(root.get("court").get("id"), courtId));
            }

            if (organizerId != null) {
                predicates.add(cb.equal(root.get("organizer").get("id"), organizerId));
            }

            if (types != null && !types.isEmpty()) {
                predicates.add(root.get("type").in(types));
            }

            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            // Filtrado por rango de fechas (solapamiento)
            if (startTime != null && endTime != null) {
                // (StartA < EndB) && (EndA > StartB)
                predicates.add(cb.and(
                        cb.lessThan(root.get("startTime"), endTime),
                        cb.greaterThan(root.get("endTime"), startTime)));
            } else if (startTime != null) {
                // Si solo hay inicio, buscamos que termine después de ese inicio
                predicates.add(cb.greaterThan(root.get("endTime"), startTime));
            } else if (endTime != null) {
                // Si solo hay fin, buscamos que empiece antes de ese fin
                predicates.add(cb.lessThan(root.get("startTime"), endTime));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("attendeePrice"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("attendeePrice"), maxPrice));
            }

            if (title != null && !title.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Constructor de especificación combinada.
     */
    public static Specification<BookingEntity> buildEntity(
            String q,
            UUID courtId,
            UUID organizerId,
            Collection<BookingType> types,
            Collection<BookingStatus> statuses,
            Boolean isActive,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String title) {
        return Specification.where(searchByQEntity(q))
                .and(filteredByAtributosEntity(courtId, organizerId, types, statuses, isActive, startTime, endTime,
                        minPrice, maxPrice, title));
    }
}