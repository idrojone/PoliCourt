package com.policourt.springboot.booking.presentation.response;

import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record BookingResponse(
    String slug,
    String courtSlug,
    String organizerUsername,
    BookingType type,
    String title,
    String description,
    LocalDateTime startTime,
    LocalDateTime endTime,
    BigDecimal totalPrice,
    BookingStatus status,
    boolean isActive,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<AttendeeResponse> attendees
) {
    // DTO anidado para los participantes
    public record AttendeeResponse(String username, String status) {}
}
