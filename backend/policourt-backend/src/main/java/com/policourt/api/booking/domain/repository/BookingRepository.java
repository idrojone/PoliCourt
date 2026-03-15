package com.policourt.api.booking.domain.repository;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.booking.domain.model.Booking;
import com.policourt.api.booking.domain.model.Training;
import com.policourt.api.club.domain.model.Club;
import com.policourt.api.booking.domain.model.Class;

import java.util.Optional;
import java.time.OffsetDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface BookingRepository {
    Booking saveBooking(Booking booking);

    Class saveClass(Class bookingClass);

    Training saveTraining(Training training);
    
    Optional<Booking> findByUuid(String uuid);
        Optional<Booking> findById(Long id);
    Optional<Class> findClassByUuid(String uuid);
    Optional<Training> findTrainingByUuid(String uuid);

    Optional<Class> findByTitle(String title);

    Page<Booking> findByFilters(String q, String sportSlug, String courtSlug, String organizerUsername,
            BookingTypeEnum type, BookingStatusEnum status, Boolean isActive, Pageable pageable);

    Page<Class> findClassesByFilters(String q, String sportSlug, String courtSlug, String organizerUsername,
            BookingStatusEnum status, Boolean isActive, Pageable pageable);

    Page<Training> findTrainingsByFilters(String q, String sportSlug, String courtSlug, String organizerUsername, Club club,
            BookingStatusEnum status, Boolean isActive, Pageable pageable);

        boolean existsActiveBookingForCourtAndTime(Long courtId, OffsetDateTime startTime, OffsetDateTime endTime);

        void lockSlotNowait(Long courtId, OffsetDateTime startTime, OffsetDateTime endTime);
    
} 