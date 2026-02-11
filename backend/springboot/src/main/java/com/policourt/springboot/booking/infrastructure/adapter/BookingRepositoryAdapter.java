package com.policourt.springboot.booking.infrastructure.adapter;

import com.policourt.springboot.booking.domain.model.Booking;
import com.policourt.springboot.booking.domain.model.BookingStatus;
import com.policourt.springboot.booking.domain.model.BookingType;
import com.policourt.springboot.booking.domain.repository.BookingRepository;
import com.policourt.springboot.booking.infrastructure.mapper.BookingEntityMapper;
import com.policourt.springboot.booking.infrastructure.entity.BookingEntity;
import com.policourt.springboot.booking.infrastructure.repository.BookingJpaRepository;
import com.policourt.springboot.booking.infrastructure.specifications.BookingSpecification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Adaptador de infraestructura que implementa el contrato del repositorio de
 * reservas.
 * Se encarga de la comunicación con la base de datos a través de JPA y la
 * conversión entre
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
        if (bookingEntity == null)
            throw new IllegalArgumentException("Booking entity no puede ser null");
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
            LocalDateTime endTime) {
        var spec = BookingSpecification.overlappingBookings(courtId, startTime, endTime);
        if (spec == null)
            throw new IllegalArgumentException("Booking specification no puede ser null");
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
            UUID excludeBookingId) {
        var spec = BookingSpecification.overlappingBookingsExcluding(courtId, startTime, endTime, excludeBookingId);
        if (spec == null)
            throw new IllegalArgumentException("Booking specification no puede ser null");
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
        if (bookingId == null)
            throw new IllegalArgumentException("Booking ID no puede ser null");
        if (newStatus == null)
            throw new IllegalArgumentException("New status no puede ser null");

        BookingEntity entity = bookingJpaRepository
                .findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Reserva con ID " + bookingId + " no encontrada."));
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
        if (id == null)
            throw new IllegalArgumentException("Booking ID no puede ser null");
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
            LocalDateTime endTime) {
        if (courtId == null)
            throw new IllegalArgumentException("Court ID no puede ser null");
        if (startTime == null)
            throw new IllegalArgumentException("Start time no puede ser null");
        if (endTime == null)
            throw new IllegalArgumentException("End time no puede ser null");
        return bookingJpaRepository.cancelBookingsInRange(
                courtId,
                startTime,
                endTime,
                BookingStatus.CANCELLED);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional
    public Booking updateIsActive(UUID bookingId, boolean isActive) {
        if (bookingId == null)
            throw new IllegalArgumentException("Booking ID no puede ser null");
        BookingEntity entity = bookingJpaRepository
                .findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Reserva con ID " + bookingId + " no encontrada."));
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
        if (booking == null)
            throw new IllegalArgumentException("Booking no puede ser null");
        UUID bookingId = booking.getId();
        if (bookingId == null)
            throw new IllegalArgumentException("Booking ID no puede ser null");

        BookingEntity entity = bookingJpaRepository
                .findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Reserva con ID " + bookingId + " no encontrada."));

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
            BookingStatus status) {
        if (bookingId == null)
            throw new IllegalArgumentException("Booking ID no puede ser null");
        if (status == null)
            throw new IllegalArgumentException("Status no puede ser null");
        BookingEntity entity = bookingJpaRepository
                .findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Reserva con ID " + bookingId + " no encontrada."));
        entity.setIsActive(isActive);
        entity.setStatus(status);
        var savedEntity = bookingJpaRepository.save(entity);
        return bookingEntityMapper.toDomain(savedEntity);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Booking> searchByType(
            BookingType type,
            UUID courtId,
            UUID organizerId,
            BookingStatus status,
            Boolean isActive,
            LocalDateTime startTime,
            LocalDateTime endTime,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String q,
            Pageable pageable) {
        var spec = BookingSpecification.buildEntity(
                q,
                courtId,
                organizerId,
                type != null ? Collections.singleton(type) : null,
                status != null ? Collections.singleton(status) : null,
                isActive,
                startTime,
                endTime,
                minPrice,
                maxPrice,
                null // title — ya cubierto por q
        );
        if (spec == null)
            throw new IllegalArgumentException("Booking specification no puede ser null");
        return bookingJpaRepository
                .findAll(spec, pageable)
                .map(bookingEntityMapper::toDomain);
    }
}
