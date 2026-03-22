package com.policourt.api.booking.infrastructure.adapter;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.time.OffsetDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.booking.domain.model.Class;
import com.policourt.api.booking.domain.model.Training;
import com.policourt.api.booking.domain.repository.BookingRepository;
import com.policourt.api.booking.infrastructure.entity.BookingEntity;
import com.policourt.api.booking.infrastructure.mapper.BookingMapper;
import com.policourt.api.booking.infrastructure.repository.BookingJpaRepository;
import com.policourt.api.booking.infrastructure.specifications.BookingSpecifications;
import com.policourt.api.club.domain.model.Club;
import com.policourt.api.club.infrastructure.repository.ClubJpaRepository;
import com.policourt.api.court.infrastructure.repository.CourtJpaRepository;
import com.policourt.api.sport.infrastructure.repository.SportJpaRepository;
import com.policourt.api.user.infrastructure.repository.UserJpaRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
@SuppressWarnings("null")
public class BookingRepositoryAdapter implements BookingRepository {

    private final BookingJpaRepository bookingJpaRepository;
    private final CourtJpaRepository courtJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final SportJpaRepository sportJpaRepository;
    private final ClubJpaRepository clubJpaRepository;
    private final BookingMapper bookingMapper;

    @Override
    public Booking saveBooking(Booking booking) {
        return save(booking);
    }

    @Override
    public Class saveClass(Class bookingClass) {
        return (Class) save(bookingClass);
    }

    @Override
    public Training saveTraining(Training training) {
        return (Training) save(training);
    }

    private Booking save(Booking booking) {
        BookingEntity entity;

        if (booking.getId() != null) {
            entity = bookingJpaRepository.findById(booking.getId())
                    .orElseGet(() -> bookingMapper.toEntity(booking));
            bookingMapper.updateEntity(entity, booking);
        } else {
            entity = bookingMapper.toEntity(booking);
        }

        if (booking.getCourt() != null) {
            var court = courtJpaRepository.findById(booking.getCourt().getId())
                    .orElseThrow(() -> new RuntimeException("Court not found with id: " + booking.getCourt().getId()));
            entity.setCourt(court);
        }

        if (booking.getOrganizer() != null) {
            var organizer = userJpaRepository.findById(booking.getOrganizer().getId())
                    .orElseThrow(() -> new RuntimeException("Organizer not found with id: " + booking.getOrganizer().getId()));
            entity.setOrganizer(organizer);
        }

        if (booking.getSport() != null) {
            var sport = sportJpaRepository.findById(booking.getSport().getId())
                    .orElseThrow(() -> new RuntimeException("Sport not found with id: " + booking.getSport().getId()));
            entity.setSport(sport);
        }

        if (booking instanceof Training training && training.getClub() != null) {
            var club = clubJpaRepository.findById(training.getClub().getId())
                    .orElseThrow(() -> new RuntimeException("Club not found with id: " + training.getClub().getId()));
            entity.setClub(club);
        }

        return bookingMapper.toDomain(bookingJpaRepository.save(entity));
    }

    @Override
    public Optional<Booking> findByUuid(String uuid) {
        try {
            return bookingJpaRepository.findByUuid(UUID.fromString(uuid)).map(bookingMapper::toDomain);
        } catch (IllegalArgumentException ex) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<Booking> findById(Long id) {
        return bookingJpaRepository.findById(id).map(bookingMapper::toDomain);
    }

    @Override
    public Optional<Class> findClassByUuid(String uuid) {
        return findByUuid(uuid)
                .filter(b -> b instanceof Class)
                .map(b -> (Class) b);
    }

    @Override
    public Optional<Training> findTrainingByUuid(String uuid) {
        return findByUuid(uuid)
                .filter(b -> b instanceof Training)
                .map(b -> (Training) b);
    }

    @Override
    public Optional<Class> findByTitle(String title) {
        return bookingJpaRepository.findByTitle(title)
                .map(bookingMapper::toDomain)
                .filter(b -> b instanceof Class)
                .map(b -> (Class) b);
    }

    @Override
    public Page<Booking> findByFilters(String q, String sportSlug, String courtSlug, String organizerUsername,
            BookingTypeEnum type, BookingStatusEnum status, Boolean isActive, Pageable pageable) {
        var spec = BookingSpecifications.filteredByFilters(q, sportSlug, courtSlug, organizerUsername, type, status,
                isActive, null);
        return bookingJpaRepository.findAll(spec, pageable).map(bookingMapper::toDomain);
    }

    @Override
    public Page<Class> findClassesByFilters(String q, String sportSlug, String courtSlug, String organizerUsername,
            BookingStatusEnum status, Boolean isActive, Pageable pageable) {
        var spec = BookingSpecifications.filteredByFilters(q, sportSlug, courtSlug, organizerUsername,
                BookingTypeEnum.CLASS, status, isActive, null);
        Page<Booking> page = bookingJpaRepository.findAll(spec, pageable).map(bookingMapper::toDomain);

        List<Class> content = page.getContent().stream()
                .filter(b -> b instanceof Class)
                .map(b -> (Class) b)
                .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @Override
    public Page<Training> findTrainingsByFilters(String q, String sportSlug, String courtSlug,
            String organizerUsername, Club club, BookingStatusEnum status, Boolean isActive, Pageable pageable) {
        Long clubId = club != null ? club.getId() : null;
        var spec = BookingSpecifications.filteredByFilters(q, sportSlug, courtSlug, organizerUsername,
                BookingTypeEnum.TRAINING, status, isActive, clubId);
        Page<Booking> page = bookingJpaRepository.findAll(spec, pageable).map(bookingMapper::toDomain);

        List<Training> content = page.getContent().stream()
                .filter(b -> b instanceof Training)
                .map(b -> (Training) b)
                .collect(Collectors.toList());

        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @Override
    public boolean existsActiveBookingForCourtAndTime(Long courtId, OffsetDateTime startTime, OffsetDateTime endTime) {
        return bookingJpaRepository.existsActiveBookingForCourtAndTime(courtId, startTime, endTime) != null;
    }

    @Override
    public void lockSlotNowait(Long courtId, OffsetDateTime startTime, OffsetDateTime endTime) {
        bookingJpaRepository.lockSlotNowait(courtId, startTime, endTime);
    }

    @Override
    public int cancelOldPendingBookings(OffsetDateTime cutoff) {
        return bookingJpaRepository.cancelOldPendingBookings(cutoff);
    }
}
