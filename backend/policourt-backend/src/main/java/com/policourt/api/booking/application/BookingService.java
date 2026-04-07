package com.policourt.api.booking.application;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.dao.DataAccessException;
import java.sql.SQLException;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.booking.domain.exception.BookingNotFoundException;
import com.policourt.api.booking.domain.exception.BookingTypeMismatchException;
import com.policourt.api.booking.domain.exception.BookingSlotUnavailableException;
import org.springframework.dao.DataIntegrityViolationException;
import com.policourt.api.booking.domain.exception.BookingCancellationNotAllowedException;
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
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;
    private final SportRepository sportRepository;
    private final ClubRepository clubRepository;
    private final PlatformTransactionManager transactionManager;

    private static final int MAX_RETRIES = 5;

    public Page<Booking> getBookings(String q, String sportSlug, String courtSlug, String organizerUsername,
            BookingStatusEnum status, Boolean isActive, int page, int limit, String sort) {
        var pageable = createPageable(page, limit, sort);
        return bookingRepository.findByFilters(q, sportSlug, courtSlug, organizerUsername, null, status, isActive,
                pageable);
    }

    public List<Booking> getBookedSlotsByCourtSlug(String courtSlug) {
        return bookingRepository.findByFilters(null, null, courtSlug, null, null, null, true, Pageable.unpaged())
                .getContent().stream()
                .filter(booking -> booking.getStatus() != BookingStatusEnum.CANCELLED)
                .sorted(Comparator.comparing(Booking::getStartTime))
                .toList();
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

    public Page<Booking> getConfirmedRentalsByUser(String username, int page, int limit, String sort) {
        userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        var pageable = createPageable(page, limit, sort);

        var rentalsPage = bookingRepository.findByFilters(null, null, null, username, BookingTypeEnum.RENTAL,
                null, true, pageable);

        var filteredRentals = rentalsPage.getContent().stream()
                .filter(r -> r.getStatus() == BookingStatusEnum.CONFIRMED || r.getStatus() == BookingStatusEnum.SUCCESS)
                .toList();

        return new org.springframework.data.domain.PageImpl<>(filteredRentals, pageable, filteredRentals.size());
    }

    public Booking createRental(Booking rental) {
        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                TransactionTemplate template = new TransactionTemplate(transactionManager);
                template.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
                template.setIsolationLevel(TransactionDefinition.ISOLATION_SERIALIZABLE);

                Booking created = template.execute(status -> {
                    prepareForSave(rental);
                    rental.setType(BookingTypeEnum.RENTAL);

                        if (rental.getCourt() != null && rental.getCourt().getId() != null) {
                        bookingRepository.lockSlotNowait(rental.getCourt().getId(), rental.getStartTime(), rental.getEndTime());
                        if (bookingRepository.existsActiveBookingForCourtAndTime(rental.getCourt().getId(), rental.getStartTime(), rental.getEndTime())) {
                            var conflicts = bookingRepository.findActiveByCourtAndTimeRange(rental.getCourt().getId(), rental.getStartTime(), rental.getEndTime(),
                                    List.of(BookingTypeEnum.RENTAL, BookingTypeEnum.CLASS, BookingTypeEnum.TRAINING));
                            if (conflicts != null && !conflicts.isEmpty()) {
                                log.warn("Conflicting bookings found for court {} {}-{}: {}", rental.getCourt().getId(), rental.getStartTime(), rental.getEndTime(), conflicts);
                            } else {
                                log.warn("existsActiveBookingForCourtAndTime returned true but no overlapping bookings found for court {} {}-{}", rental.getCourt().getId(), rental.getStartTime(), rental.getEndTime());
                            }
                            throw new BookingSlotUnavailableException();
                        }
                    }

                    return bookingRepository.saveBooking(rental);
                });

                if (created != null) {
                    return created;
                }
            } catch (DataIntegrityViolationException ex) {
                throw new BookingSlotUnavailableException();
            } catch (DataAccessException ex) {
                String sqlState = extractSqlState(ex);
                if ("40001".equals(sqlState)) {
                    continue;
                }
                if ("55P03".equals(sqlState)) {
                    throw new BookingSlotUnavailableException();
                }
                throw ex;
            }
        }

        throw new com.policourt.api.booking.domain.exception.BookingConcurrencyException();
    }

    public Class createClass(Class bookingClass) {
        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                TransactionTemplate template = new TransactionTemplate(transactionManager);
                template.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
                template.setIsolationLevel(TransactionDefinition.ISOLATION_SERIALIZABLE);

                Class created = template.execute(status -> {
                    prepareForSave(bookingClass);
                    bookingClass.setType(BookingTypeEnum.CLASS);

                    if (bookingClass.getCourt() != null && bookingClass.getCourt().getId() != null) {
                        bookingRepository.lockSlotNowait(bookingClass.getCourt().getId(), bookingClass.getStartTime(), bookingClass.getEndTime());
                        if (bookingRepository.existsActiveBookingForCourtAndTime(bookingClass.getCourt().getId(), bookingClass.getStartTime(), bookingClass.getEndTime())) {
                            var conflicts = bookingRepository.findActiveByCourtAndTimeRange(bookingClass.getCourt().getId(), bookingClass.getStartTime(), bookingClass.getEndTime(),
                                    List.of(BookingTypeEnum.RENTAL, BookingTypeEnum.CLASS, BookingTypeEnum.TRAINING));
                            if (conflicts != null && !conflicts.isEmpty()) {
                                log.warn("Conflicting bookings found for court {} {}-{}: {}", bookingClass.getCourt().getId(), bookingClass.getStartTime(), bookingClass.getEndTime(), conflicts);
                            } else {
                                log.warn("existsActiveBookingForCourtAndTime returned true but no overlapping bookings found for court {} {}-{}", bookingClass.getCourt().getId(), bookingClass.getStartTime(), bookingClass.getEndTime());
                            }
                            throw new BookingSlotUnavailableException();
                        }
                    }

                    return bookingRepository.saveClass(bookingClass);
                });

                if (created != null) {
                    return created;
                }
            } catch (DataIntegrityViolationException ex) {
                throw new BookingSlotUnavailableException();
            } catch (DataAccessException ex) {
                String sqlState = extractSqlState(ex);
                if ("40001".equals(sqlState)) {
                    continue;
                }
                if ("55P03".equals(sqlState)) {
                    throw new BookingSlotUnavailableException();
                }
                throw ex;
            }
        }

        throw new com.policourt.api.booking.domain.exception.BookingConcurrencyException();
    }

    public Training createTraining(Training training) {
        for (int attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                TransactionTemplate template = new TransactionTemplate(transactionManager);
                template.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
                template.setIsolationLevel(TransactionDefinition.ISOLATION_SERIALIZABLE);

                Training created = template.execute(status -> {
                    prepareForSave(training);
                    training.setType(BookingTypeEnum.TRAINING);

                    if (training.getCourt() != null && training.getCourt().getId() != null) {
                        bookingRepository.lockSlotNowait(training.getCourt().getId(), training.getStartTime(), training.getEndTime());
                        if (bookingRepository.existsActiveBookingForCourtAndTime(training.getCourt().getId(), training.getStartTime(), training.getEndTime())) {
                            var conflicts = bookingRepository.findActiveByCourtAndTimeRange(training.getCourt().getId(), training.getStartTime(), training.getEndTime(),
                                    List.of(BookingTypeEnum.RENTAL, BookingTypeEnum.CLASS, BookingTypeEnum.TRAINING));
                            if (conflicts != null && !conflicts.isEmpty()) {
                                log.warn("Conflicting bookings found for court {} {}-{}: {}", training.getCourt().getId(), training.getStartTime(), training.getEndTime(), conflicts);
                            } else {
                                log.warn("existsActiveBookingForCourtAndTime returned true but no overlapping bookings found for court {} {}-{}", training.getCourt().getId(), training.getStartTime(), training.getEndTime());
                            }
                            throw new BookingSlotUnavailableException();
                        }
                    }

                    return bookingRepository.saveTraining(training);
                });

                if (created != null) {
                    return created;
                }
            } catch (DataIntegrityViolationException ex) {
                throw new BookingSlotUnavailableException();
            } catch (DataAccessException ex) {
                String sqlState = extractSqlState(ex);
                if ("40001".equals(sqlState)) {
                    continue;
                }
                if ("55P03".equals(sqlState)) {
                    throw new BookingSlotUnavailableException();
                }
                throw ex;
            }
        }

        throw new com.policourt.api.booking.domain.exception.BookingConcurrencyException();
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

    public void deleteClassByMonitor(String uuid, String username) {
        Booking existing = findByUuidOrThrow(uuid);
        if (existing.getType() != BookingTypeEnum.CLASS) {
            throw new BookingTypeMismatchException(uuid);
        }

        if (existing.getOrganizer() == null || existing.getOrganizer().getUsername() == null
                || !existing.getOrganizer().getUsername().equals(username)) {
            throw new BookingCancellationNotAllowedException("Solo el monitor organizador puede eliminar la clase");
        }

        Class existingClass = (Class) existing;
        existingClass.setIsActive(false);
        existingClass.setUpdatedAt(OffsetDateTime.now());
        bookingRepository.saveClass(existingClass);
    }

    @Scheduled(cron = "0 */10 * * * *")
    public void cancelExpiredPendingBookings() {
        OffsetDateTime cutoff = OffsetDateTime.now().minusMinutes(15);
        int cancelled = bookingRepository.cancelOldPendingBookings(cutoff);
        if (cancelled > 0) {
            System.out.println("[SCHEDULE] Cancelled " + cancelled + " stale PENDING bookings");
        }
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

    private String extractSqlState(Throwable ex) {
        Throwable current = ex;
        while (current != null) {
            if (current instanceof SQLException sqlEx) {
                return sqlEx.getSQLState();
            }
            current = current.getCause();
        }
        return null;
    }
}
