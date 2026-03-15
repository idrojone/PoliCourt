package com.policourt.api.booking.application;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.booking.domain.exception.BookingNotFoundException;
import com.policourt.api.booking.domain.exception.BookingTypeMismatchException;
import com.policourt.api.booking.domain.exception.UserNotFoundException;
import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.booking.domain.model.Class;
import com.policourt.api.booking.domain.model.Training;
import com.policourt.api.booking.domain.repository.BookingRepository;
import com.policourt.api.club.domain.exception.ClubNotFoundException;
import com.policourt.api.club.domain.repository.ClubRepository;
import com.policourt.api.court.domain.exception.CourtNotFoundException;
import com.policourt.api.court.domain.repository.CourtRepository;
import com.policourt.api.sport.domain.exception.SportNotFoundException;
import com.policourt.api.sport.domain.repository.SportRepository;
import com.policourt.api.user.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;
    private final SportRepository sportRepository;
    private final ClubRepository clubRepository;

    public Page<Booking> getBookings(String q, String sportSlug, String courtSlug, String organizerUsername,
            BookingStatusEnum status, Boolean isActive, int page, int limit, String sort) {
        var pageable = createPageable(page, limit, sort);
        return bookingRepository.findByFilters(q, sportSlug, courtSlug, organizerUsername, null, status, isActive,
                pageable);
    }

    public Page<Class> getClasses(String q, String sportSlug, String courtSlug, String organizerUsername,
            BookingStatusEnum status, Boolean isActive, int page, int limit, String sort) {
        var pageable = createPageable(page, limit, sort);
        return bookingRepository.findClassesByFilters(q, sportSlug, courtSlug, organizerUsername, status, isActive,
                pageable);
    }

    public Page<Training> getTrainings(String q, String sportSlug, String courtSlug, String organizerUsername,
            String clubSlug, BookingStatusEnum status, Boolean isActive, int page, int limit, String sort) {
        var pageable = createPageable(page, limit, sort);
        var club = clubSlug != null ? clubRepository.findBySlug(clubSlug)
                .orElseThrow(() -> new ClubNotFoundException(clubSlug))
                : null;
        return bookingRepository.findTrainingsByFilters(q, sportSlug, courtSlug, organizerUsername, club, status,
                isActive, pageable);
    }

    public Booking createRental(Booking rental) {
        prepareForSave(rental);
        rental.setType(BookingTypeEnum.RENTAL);
        return bookingRepository.saveBooking(rental);
    }

    public Class createClass(Class bookingClass) {
        prepareForSave(bookingClass);
        bookingClass.setType(BookingTypeEnum.CLASS);
        return bookingRepository.saveClass(bookingClass);
    }

    public Training createTraining(Training training) {
        prepareForSave(training);
        training.setType(BookingTypeEnum.TRAINING);
        return bookingRepository.saveTraining(training);
    }

    public Booking updateRental(String uuid, Booking rental) {
        Booking existing = findByUuidOrThrow(uuid);
        if (existing.getType() != BookingTypeEnum.RENTAL) {
            throw new BookingTypeMismatchException(uuid);
        }

        copyCommonFields(existing, rental);
        resolveReferences(existing);
        existing.setType(BookingTypeEnum.RENTAL);
        existing.setUpdatedAt(OffsetDateTime.now());
        return bookingRepository.saveBooking(existing);
    }

    public Class updateClass(String uuid, Class bookingClass) {
        Booking existing = findByUuidOrThrow(uuid);
        if (existing.getType() != BookingTypeEnum.CLASS) {
            throw new BookingTypeMismatchException(uuid);
        }

        Class existingClass = (Class) existing;
        copyCommonFields(existingClass, bookingClass);
        resolveReferences(existingClass);
        existingClass.setTitle(bookingClass.getTitle());
        existingClass.setDescription(bookingClass.getDescription());
        existingClass.setAttendeePrice(bookingClass.getAttendeePrice());
        existingClass.setUpdatedAt(OffsetDateTime.now());
        return bookingRepository.saveClass(existingClass);
    }

    public Training updateTraining(String uuid, Training training) {
        Booking existing = findByUuidOrThrow(uuid);
        if (existing.getType() != BookingTypeEnum.TRAINING) {
            throw new BookingTypeMismatchException(uuid);
        }

        Training existingTraining = (Training) existing;
        copyCommonFields(existingTraining, training);
        resolveReferences(existingTraining);
        existingTraining.setClub(training.getClub());
        existingTraining.setAttendeePrice(training.getAttendeePrice());
        existingTraining.setUpdatedAt(OffsetDateTime.now());
        return bookingRepository.saveTraining(existingTraining);
    }

    public void softDelete(String uuid) {
        Booking existing = findByUuidOrThrow(uuid);
        existing.setIsActive(false);
        existing.setUpdatedAt(OffsetDateTime.now());
        bookingRepository.saveBooking(existing);
    }

    public Booking changeStatus(String uuid, BookingStatusEnum status) {
        Booking existing = findByUuidOrThrow(uuid);
        existing.setStatus(status);
        existing.setUpdatedAt(OffsetDateTime.now());
        return bookingRepository.saveBooking(existing);
    }

    private Booking findByUuidOrThrow(String uuid) {
        return bookingRepository.findByUuid(uuid)
                .orElseThrow(() -> new BookingNotFoundException(uuid));
    }

    private void prepareForSave(Booking booking) {
        if (booking.getUuid() == null) {
            booking.setUuid(UUID.randomUUID());
        }
        if (booking.getCreatedAt() == null) {
            booking.setCreatedAt(OffsetDateTime.now());
        }
        booking.setUpdatedAt(OffsetDateTime.now());
        if (booking.getIsActive() == null) {
            booking.setIsActive(true);
        }
        resolveReferences(booking);
    }

    private void resolveReferences(Booking booking) {
        if (booking.getCourt() != null && booking.getCourt().getSlug() != null) {
            var court = courtRepository.findBySlug(booking.getCourt().getSlug())
                    .orElseThrow(() -> new CourtNotFoundException(booking.getCourt().getSlug()));
            booking.setCourt(court);
        }

        if (booking.getOrganizer() != null && booking.getOrganizer().getUsername() != null) {
            var organizer = userRepository.findByUsername(booking.getOrganizer().getUsername())
                    .orElseThrow(() -> new UserNotFoundException(booking.getOrganizer().getUsername()));
            booking.setOrganizer(organizer);
        }

        if (booking.getSport() != null && booking.getSport().getSlug() != null) {
            var sport = sportRepository.findBySlug(booking.getSport().getSlug())
                    .orElseThrow(() -> new SportNotFoundException(booking.getSport().getSlug()));
            booking.setSport(sport);
        }

        if (booking instanceof Training training && training.getClub() != null
                && training.getClub().getSlug() != null) {
            var club = clubRepository.findBySlug(training.getClub().getSlug())
                    .orElseThrow(() -> new ClubNotFoundException(training.getClub().getSlug()));
            training.setClub(club);
        }
    }

    private void copyCommonFields(Booking target, Booking source) {
        target.setCourt(source.getCourt());
        target.setOrganizer(source.getOrganizer());
        target.setSport(source.getSport());
        target.setStartTime(source.getStartTime());
        target.setEndTime(source.getEndTime());
        target.setTotalPrice(source.getTotalPrice());
        target.setIsActive(source.getIsActive());
        target.setStatus(source.getStatus());
    }

    private PageRequest createPageable(int page, int limit, String sort) {
        Sort sortObj = switch (sort) {
            case "startTime_desc" -> Sort.by("startTime").descending();
            case "endTime_asc" -> Sort.by("endTime").ascending();
            case "endTime_desc" -> Sort.by("endTime").descending();
            case "totalPrice_asc" -> Sort.by("totalPrice").ascending();
            case "totalPrice_desc" -> Sort.by("totalPrice").descending();
            case "createdAt_asc" -> Sort.by("createdAt").ascending();
            case "createdAt_desc" -> Sort.by("createdAt").descending();
            default -> Sort.by("startTime").ascending();
        };
        return PageRequest.of(Math.max(0, page - 1), limit, sortObj);
    }
}
