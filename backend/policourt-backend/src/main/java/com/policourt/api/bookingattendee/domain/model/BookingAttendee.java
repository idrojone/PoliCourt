package com.policourt.api.bookingattendee.domain.model;

import java.time.OffsetDateTime;

import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.user.domain.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingAttendee {
    private Long id;
    private Booking booking;
    private User user;
    private String status;
    private OffsetDateTime joinedAt;
}
