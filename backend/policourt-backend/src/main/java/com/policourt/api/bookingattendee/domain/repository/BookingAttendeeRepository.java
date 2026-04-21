package com.policourt.api.bookingattendee.domain.repository;

import java.util.List;
import java.util.Optional;

import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.bookingattendee.domain.model.BookingAttendee;

public interface BookingAttendeeRepository {
    BookingAttendee save(BookingAttendee attendee);
    Optional<BookingAttendee> findByBookingIdAndUserId(Long bookingId, Long userId);
    boolean existsByBookingIdAndUserId(Long bookingId, Long userId);
    List<Booking> findClassBookingsByUserId(Long userId);
}
