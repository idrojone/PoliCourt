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
public class Booking {

    private UUID id;
    private String slug;
    private Court court;
    private User organizer;
    private BookingType type;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private boolean isActive = true;

    @Builder.Default
    private List<BookingAttendee> attendees = new java.util.ArrayList<>();
}
