package com.policourt.springboot.booking.domain.model;

import com.policourt.springboot.auth.domain.model.User;
import java.time.LocalDateTime;
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
 * Modelo de dominio que representa a un asistente a una reserva o evento.
 * Vincula a un usuario con una reserva específica y realiza el seguimiento de su estado de participación.
 */
public class BookingAttendee {

    /** Identificador único del registro de asistencia (UUID). */
    private UUID id;
    /** Usuario que asiste al evento. */
    private User user;
    /** Estado de la asistencia (ej. PENDING, CONFIRMED). Coincide con el VARCHAR(50) de la BD. */
    private String status;
    /** Fecha y hora en la que el usuario se unió a la reserva. */
    private LocalDateTime joinedAt;
}
