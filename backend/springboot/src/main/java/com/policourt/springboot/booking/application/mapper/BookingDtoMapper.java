package com.policourt.springboot.booking.application.mapper;

import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingAttendee;
import com.policourt.springboot.booking.presentation.response.BookingResponse;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class BookingDtoMapper {

    public BookingResponse toResponse(Booking domain) {
        if (domain == null) {
            return null;
        }

        List<BookingResponse.AttendeeResponse> attendeeResponses =
            domain.getAttendees() != null
                ? domain
                      .getAttendees()
                      .stream()
                      .map(this::toAttendeeResponse)
                      .collect(Collectors.toList())
                : Collections.emptyList();

        return new BookingResponse(
            domain.getSlug(),
            domain.getCourt().getSlug(),
            domain.getOrganizer().getUsername(),
            domain.getType(),
            domain.getTitle(),
            domain.getDescription(),
            domain.getStartTime(),
            domain.getEndTime(),
            domain.getTotalPrice(),
            domain.getAttendeePrice(),
            domain.getStatus(),
            domain.isActive(),
            domain.getCreatedAt(),
            domain.getUpdatedAt(),
            attendeeResponses
        );
    }

    private BookingResponse.AttendeeResponse toAttendeeResponse(
        BookingAttendee attendee
    ) {
        return new BookingResponse.AttendeeResponse(
            attendee.getUser().getUsername(),
            attendee.getStatus()
        );
    }
}
