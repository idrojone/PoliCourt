package com.policourt.springboot.booking.domain.model;

import com.policourt.springboot.auth.domain.model.User;
import com.policourt.springboot.court.domain.model.Court;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
/**
 * Modelo de dominio que representa una reserva o evento en una pista deportiva.
 * Centraliza la información de horarios, participantes, precios y estado de la reserva.
 */
public class Booking {

    /** Identificador único de la reserva (UUID). */
    private UUID id;
    /** Identificador amigable para URLs. */
    private String slug;
    /** Pista deportiva donde se realiza la reserva. */
    private Court court;
    /** Usuario que organiza y es responsable de la reserva. */
    private User organizer;
    /** Tipo de reserva (RENTAL, CLASS, TRAINING). */
    private BookingType type;
    /** Título descriptivo del evento o reserva. */
    private String title;
    /** Información adicional o reglas específicas de la reserva. */
    private String description;
    /** Fecha y hora de inicio. */
    private LocalDateTime startTime;
    /** Fecha y hora de finalización. */
    private LocalDateTime endTime;
    /** Precio total de la reserva de la pista. */
    private BigDecimal totalPrice;
    /** Precio individual por asistente (si aplica). */
    private BigDecimal attendeePrice;
    /** Estado actual de la reserva (CONFIRMED, PENDING, CANCELLED, COMPLETED). */
    private BookingStatus status;
    /** Fecha y hora de creación del registro. */
    private LocalDateTime createdAt;
    /** Fecha y hora de la última actualización. */
    private LocalDateTime updatedAt;

    /** Indica si el registro está activo (borrado lógico). */
    @Builder.Default
    private boolean isActive = true;

    /** Lista de usuarios que asistirán a la reserva. */
    @Builder.Default
    private List<BookingAttendee> attendees = new java.util.ArrayList<>();
}
