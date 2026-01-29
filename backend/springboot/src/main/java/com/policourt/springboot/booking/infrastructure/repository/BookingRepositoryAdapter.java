package com.policourt.springboot.booking.infrastructure.repository;

import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.domain.repository.BookingRepository;
import com.policourt.springboot.booking.infrastructure.mapper.BookingEntityMapper;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@RequiredArgsConstructor
public class BookingRepositoryAdapter implements BookingRepository {

    private final BookingJpaRepository bookingJpaRepository;
    private final BookingEntityMapper bookingEntityMapper;

    @Override
    @Transactional
    public Booking save(Booking booking) {
        var bookingEntity = bookingEntityMapper.toEntity(booking);
        var savedEntity = bookingJpaRepository.save(bookingEntity);
        return bookingEntityMapper.toDomain(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Booking> findBySlug(String slug) {
        return bookingJpaRepository
            .findBySlug(slug)
            .map(bookingEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByCourtIdAndDateRange(
        UUID courtId,
        LocalDateTime startTime,
        LocalDateTime endTime
    ) {
        return bookingJpaRepository
            .findOverlappingBookings(courtId, startTime, endTime)
            .stream()
            .map(bookingEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByOrganizerId(UUID organizerId) {
        return bookingJpaRepository
            .findByOrganizerId(organizerId)
            .stream()
            .map(bookingEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByType(BookingType type) {
        return bookingJpaRepository
            .findByType(type)
            .stream()
            .map(bookingEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Booking updateStatus(UUID bookingId, BookingStatus newStatus) {
        var entity = bookingJpaRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Reserva con ID " + bookingId + " no encontrada."
            ));
        entity.setStatus(newStatus);
        var savedEntity = bookingJpaRepository.save(entity);
        return bookingEntityMapper.toDomain(savedEntity);
    }

    @Override
    @Transactional
    public int cancelBookingsInRange(UUID courtId, LocalDateTime startTime, LocalDateTime endTime) {
        return bookingJpaRepository.cancelBookingsInRange(
            courtId,
            startTime,
            endTime,
            BookingStatus.CANCELLED
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Booking> findById(UUID id) {
        return bookingJpaRepository
            .findById(id)
            .map(bookingEntityMapper::toDomain);
    }

    @Override
    @Transactional
    public Booking updateIsActive(UUID bookingId, boolean isActive) {
        var entity = bookingJpaRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Reserva con ID " + bookingId + " no encontrada."
            ));
        entity.setIsActive(isActive);
        var savedEntity = bookingJpaRepository.save(entity);
        return bookingEntityMapper.toDomain(savedEntity);
    }
}
