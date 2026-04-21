package com.policourt.api.bookingattendee.infrastructure.mapper;

import org.springframework.stereotype.Component;

import com.policourt.api.bookingattendee.domain.model.BookingAttendee;
import com.policourt.api.bookingattendee.infrastructure.entity.BookingAttendeeEntity;
import com.policourt.api.booking.infrastructure.mapper.BookingMapper;
import com.policourt.api.user.infrastructure.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingAttendeeMapper {

    private final BookingMapper bookingMapper;
    private final UserMapper userMapper;

    public BookingAttendee toDomain(BookingAttendeeEntity entity) {
        if (entity == null) {
            return null;
        }
        return BookingAttendee.builder()
                .id(entity.getId())
                .booking(bookingMapper.toDomain(entity.getBooking()))
                .user(userMapper.toDomain(entity.getUser()))
                .status(entity.getStatus())
                .joinedAt(entity.getJoinedAt())
                .build();
    }

    public BookingAttendeeEntity toEntity(BookingAttendee attendee) {
        if (attendee == null) {
            return null;
        }
        return BookingAttendeeEntity.builder()
                .id(attendee.getId())
                .booking(bookingMapper.toEntity(attendee.getBooking()))
                .user(userMapper.toEntity(attendee.getUser()))
                .status(attendee.getStatus())
                .build();
    }

    public void updateEntity(BookingAttendeeEntity entity, BookingAttendee attendee) {
        if (attendee.getBooking() != null && attendee.getBooking().getId() != null) {
            entity.setBooking(bookingMapper.toEntity(attendee.getBooking()));
        }
        if (attendee.getUser() != null && attendee.getUser().getId() != null) {
            entity.setUser(userMapper.toEntity(attendee.getUser()));
        }
        entity.setStatus(attendee.getStatus());
    }
}
