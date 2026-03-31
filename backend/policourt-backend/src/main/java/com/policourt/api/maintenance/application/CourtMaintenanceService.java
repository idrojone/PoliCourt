package com.policourt.api.maintenance.application;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.policourt.api.booking.application.BookingCancellationService;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.booking.application.model.BookingCancellationResult;
import com.policourt.api.booking.domain.repository.BookingRepository;
import com.policourt.api.court.domain.exception.CourtNotFoundException;
import com.policourt.api.court.domain.repository.CourtRepository;
import com.policourt.api.maintenance.domain.enums.MaintenanceStatusEnum;
import com.policourt.api.maintenance.domain.exception.MaintenanceConflictException;
import com.policourt.api.maintenance.domain.model.CourtMaintenance;
import com.policourt.api.maintenance.domain.model.CreateMaintenanceCommand;
import com.policourt.api.maintenance.domain.model.MaintenanceCreationResult;
import com.policourt.api.maintenance.domain.repository.CourtMaintenanceRepository;
import com.policourt.api.booking.domain.exception.UserNotFoundException;
import com.policourt.api.user.domain.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourtMaintenanceService {

    private final CourtRepository courtRepository;
    private final UserRepository userRepository;
    private final CourtMaintenanceRepository maintenanceRepository;
    private final BookingRepository bookingRepository;
    private final BookingCancellationService bookingCancellationService;

    @Transactional
    public MaintenanceCreationResult createMaintenance(CreateMaintenanceCommand command) {
        var court = courtRepository.findBySlug(command.getCourtSlug())
                .orElseThrow(() -> new CourtNotFoundException(command.getCourtSlug()));
        var creator = userRepository.findByUsername(command.getCreatedByUsername())
                .orElseThrow(() -> new UserNotFoundException(command.getCreatedByUsername()));

        if (maintenanceRepository.existsActiveOverlap(court.getId(), command.getStartTime(), command.getEndTime())) {
            throw new MaintenanceConflictException();
        }

        CourtMaintenance maintenance = CourtMaintenance.builder()
                .uuid(UUID.randomUUID())
                .court(court)
                .createdBy(creator)
                .title(command.getTitle())
                .description(command.getDescription())
                .startTime(command.getStartTime())
                .endTime(command.getEndTime())
                .status(MaintenanceStatusEnum.SCHEDULED)
                .isActive(true)
                .createdAt(OffsetDateTime.now())
                .updatedAt(OffsetDateTime.now())
                .build();

        maintenance = maintenanceRepository.save(maintenance);

        List<BookingCancellationResult> cancelled = bookingRepository
                .findActiveByCourtAndTimeRange(court.getId(), command.getStartTime(), command.getEndTime(),
                        List.of(BookingTypeEnum.RENTAL, BookingTypeEnum.CLASS, BookingTypeEnum.TRAINING))
                .stream()
                .map(booking -> bookingCancellationService
                        .cancelByMaintenance(booking, "Mantenimiento: " + command.getTitle()))
                .toList();

        return MaintenanceCreationResult.builder()
                .maintenance(maintenance)
                .cancelledBookings(cancelled)
                .build();
    }
}
