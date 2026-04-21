package com.policourt.api.bookingattendee.infrastructure.adapter;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.policourt.api.bookingattendee.domain.model.BookingAttendee;
import com.policourt.api.bookingattendee.domain.repository.BookingAttendeeRepository;
import com.policourt.api.bookingattendee.infrastructure.entity.BookingAttendeeEntity;
import com.policourt.api.bookingattendee.infrastructure.repository.BookingAttendeeJpaRepository;
import com.policourt.api.bookingattendee.infrastructure.mapper.BookingAttendeeMapper;
import com.policourt.api.booking.infrastructure.mapper.BookingMapper;
import com.policourt.api.booking.infrastructure.repository.BookingJpaRepository;
import com.policourt.api.user.infrastructure.repository.UserJpaRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class BookingAttendeeRepositoryAdapter implements BookingAttendeeRepository {

    private final BookingAttendeeJpaRepository bookingAttendeeJpaRepository;
    private final BookingJpaRepository bookingJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final BookingAttendeeMapper bookingAttendeeMapper;
    private final BookingMapper bookingMapper;

    @SuppressWarnings("null")
    @Override
    public BookingAttendee save(BookingAttendee attendee) {
        BookingAttendeeEntity entity;
        if (attendee.getId() != null) {
            Long attendeeId = Objects.requireNonNull(attendee.getId());
            entity = bookingAttendeeJpaRepository.findById(attendeeId)
                    .orElseGet(() -> bookingAttendeeMapper.toEntity(attendee));
            bookingAttendeeMapper.updateEntity(entity, attendee);
        } else {
            entity = bookingAttendeeMapper.toEntity(attendee);
        }

        if (attendee.getBooking() != null && attendee.getBooking().getId() != null) {
            Long bookingId = Objects.requireNonNull(attendee.getBooking().getId());
            var bookingEntity = bookingJpaRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
            entity.setBooking(bookingEntity);
        }

        if (attendee.getUser() != null && attendee.getUser().getId() != null) {
            Long userId = Objects.requireNonNull(attendee.getUser().getId());
            var userEntity = userJpaRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            entity.setUser(userEntity);
        }

        BookingAttendeeEntity savedEntity = Objects.requireNonNull(bookingAttendeeJpaRepository.save(entity));
        return bookingAttendeeMapper.toDomain(savedEntity);
    }

    @Override
    public Optional<BookingAttendee> findByBookingIdAndUserId(Long bookingId, Long userId) {
        return bookingAttendeeJpaRepository.findByBookingIdAndUserId(bookingId, userId)
                .map(bookingAttendeeMapper::toDomain);
    }

    @Override
    public boolean existsByBookingIdAndUserId(Long bookingId, Long userId) {
        return bookingAttendeeJpaRepository.existsByBookingIdAndUserId(bookingId, userId);
    }

    @Override
    public List<com.policourt.api.booking.domain.model.Booking> findClassBookingsByUserId(Long userId) {
        return bookingAttendeeJpaRepository.findClassBookingsByUserId(userId).stream()
                .map(bookingMapper::toDomain)
                .toList();
    }
}
