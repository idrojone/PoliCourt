package com.policourt.api.notification.application;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.notification.domain.model.NotificationMessage;
import com.policourt.api.notification.domain.port.NotificationGateway;
import com.policourt.api.order.domain.model.Order;
import com.policourt.api.tickets.domain.model.Ticket;
import com.policourt.api.user.domain.model.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private static final String DEFAULT_TONE = "empresarial";
    private static final String RESERVATION_TASK_DESCRIPTION = "Confirmación de reserva de pista";

    private final NotificationGateway notificationGateway;

    public void sendReservationConfirmation(Order order, Booking booking, Ticket ticket) {
        if (order == null || order.getUser() == null || order.getUser().getEmail() == null) {
            return;
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("ticketCode", ticket != null ? ticket.getCode() : null);
        data.put("ticketType", ticket != null ? ticket.getType() : null);
        data.put("ticketStatus", ticket != null ? ticket.getStatus() : null);
        data.put("orderId", order.getId());
        data.put("orderTotalAmount", order.getTotalAmount());
        data.put("currency", order.getCurrency());
        data.put("bookingId", booking != null ? booking.getId() : null);
        data.put("bookingUuid", booking != null && booking.getUuid() != null ? booking.getUuid().toString() : null);
        data.put("bookingStartTime", booking != null ? booking.getStartTime() : null);
        data.put("bookingEndTime", booking != null ? booking.getEndTime() : null);
        data.put("courtName", booking != null && booking.getCourt() != null ? booking.getCourt().getName() : null);
        data.put("courtSlug", booking != null && booking.getCourt() != null ? booking.getCourt().getSlug() : null);
        data.put("userName", order.getUser().getUsername());
        data.put("userFullName", buildFullName(order.getUser()));

        NotificationMessage notification = NotificationMessage.builder()
                .email(order.getUser().getEmail())
                .taskDescription(RESERVATION_TASK_DESCRIPTION)
                .tone(DEFAULT_TONE)
                .data(data)
                .build();

        try {
            notificationGateway.send(notification);
        } catch (RuntimeException ex) {
            log.warn("No se pudo enviar la notificación de reserva para la booking {}", booking != null ? booking.getId() : null, ex);
        }
    }

    public void sendCustomEmail(NotificationMessage message) {
        if (message == null || message.getEmail() == null) {
            return;
        }
        NotificationMessage payload = NotificationMessage.builder()
                .email(message.getEmail())
                .taskDescription(message.getTaskDescription())
                .tone(message.getTone() != null ? message.getTone() : DEFAULT_TONE)
                .data(message.getData() != null ? message.getData() : Collections.emptyMap())
                .build();

        try {
            notificationGateway.send(payload);
        } catch (RuntimeException ex) {
            log.warn("No se pudo enviar la notificación personalizada para {}", payload.getEmail(), ex);
        }
    }

    private String buildFullName(User user) {
        if (user == null) {
            return null;
        }
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        if (firstName == null && lastName == null) {
            return user.getUsername();
        }
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        }
        return Objects.requireNonNullElse(firstName, lastName);
    }
}
