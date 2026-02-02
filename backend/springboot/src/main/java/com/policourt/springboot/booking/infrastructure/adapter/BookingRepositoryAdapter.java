package com.policourt.springboot.booking.infrastructure.adapter;

import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.domain.repository.BookingRepository;
import com.policourt.springboot.booking.infrastructure.mapper.BookingEntityMapper;
import com.policourt.springboot.booking.infrastructure.entity.BookingEntity;
import com.policourt.springboot.booking.infrastructure.repository.BookingJpaRepository;
import com.policourt.springboot.booking.infrastructure.specifications.BookingSpecification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Adaptador de infraestructura que implementa el contrato del repositorio de reservas.
 * Se encarga de la comunicación con la base de datos a través de JPA y la conversión entre
 * entidades de persistencia y modelos de dominio.
 */
@Repository
@RequiredArgsConstructor
public class BookingRepositoryAdapter implements BookingRepository {

    private final BookingJpaRepository bookingJpaRepository;
    private final BookingEntityMapper bookingEntityMapper;

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Booking save(Booking booking) {
        var bookingEntity = bookingEntityMapper.toEntity(booking);
        var savedEntity = bookingJpaRepository.save(bookingEntity);
        return bookingEntityMapper.toDomain(savedEntity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Booking> findBySlug(String slug) {
        return bookingJpaRepository
            .findBySlug(slug)
            .map(bookingEntityMapper::toDomain);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByCourtIdAndDateRange(
        UUID courtId,
        LocalDateTime startTime,
        LocalDateTime endTime
    ) {
        var spec = BookingSpecification.overlappingBookings(courtId, startTime, endTime);
        return bookingJpaRepository
            .findAll(spec)
            .stream()
            .map(bookingEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByCourtIdAndDateRangeExcludingBooking(
        UUID courtId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        UUID excludeBookingId
    ) {
        var spec = BookingSpecification.overlappingBookingsExcluding(courtId, startTime, endTime, excludeBookingId);
        return bookingJpaRepository
            .findAll(spec)
            .stream()
            .map(bookingEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByOrganizerId(UUID organizerId) {
        return bookingJpaRepository
            .findByOrganizerId(organizerId)
            .stream()
            .map(bookingEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public List<Booking> findByType(BookingType type) {
        return bookingJpaRepository
            .findByType(type)
            .stream()
            .map(bookingEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Booking updateStatus(UUID bookingId, BookingStatus newStatus) {
        BookingEntity entity = bookingJpaRepository
            .findById(bookingId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Reserva con ID " + bookingId + " no encontrada."
                )
            );
        entity.setStatus(newStatus);
        var savedEntity = bookingJpaRepository.save(entity);
        return bookingEntityMapper.toDomain(savedEntity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Booking> findById(UUID id) {
        return bookingJpaRepository
            .findById(id)
            .map(bookingEntityMapper::toDomain);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public int cancelBookingsInRange(
        UUID courtId,
        LocalDateTime startTime,
        LocalDateTime endTime
    ) {
        return bookingJpaRepository.cancelBookingsInRange(
            courtId,
            startTime,
            endTime,
            BookingStatus.CANCELLED
        );
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Booking updateIsActive(UUID bookingId, boolean isActive) {
        BookingEntity entity = bookingJpaRepository
            .findById(bookingId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Reserva con ID " + bookingId + " no encontrada."
                )
            );
        entity.setIsActive(isActive);
        var savedEntity = bookingJpaRepository.save(entity);
        return bookingEntityMapper.toDomain(savedEntity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Booking update(Booking booking) {
        BookingEntity entity = bookingJpaRepository
            .findById(booking.getId())
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Reserva con ID " + booking.getId() + " no encontrada."
                )
            );

        // Actualizar campos modificables
        entity.setSlug(booking.getSlug());
        entity.setTitle(booking.getTitle());
        entity.setDescription(booking.getDescription());
        entity.setStartTime(booking.getStartTime());
        entity.setEndTime(booking.getEndTime());
        entity.setTotalPrice(booking.getTotalPrice());
        entity.setAttendeePrice(booking.getAttendeePrice());
        entity.setStatus(booking.getStatus());
        entity.setIsActive(booking.isActive());

        var savedEntity = bookingJpaRepository.save(entity);
        return bookingEntityMapper.toDomain(savedEntity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Booking updateIsActiveAndStatus(
        UUID bookingId,
        boolean isActive,
        BookingStatus status
    ) {
        BookingEntity entity = bookingJpaRepository
            .findById(bookingId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Reserva con ID " + bookingId + " no encontrada."
                )
            );
        entity.setIsActive(isActive);
        entity.setStatus(status);
        var savedEntity = bookingJpaRepository.save(entity);
        return bookingEntityMapper.toDomain(savedEntity);
    }
}
