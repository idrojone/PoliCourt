package com.policourt.api.maintenance.presentation.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.policourt.api.booking.application.model.BookingCancellationResult;
import com.policourt.api.booking.presentation.mapper.BookingPresentationMapper;
import com.policourt.api.booking.presentation.response.BookingCancellationResponse;
import com.policourt.api.maintenance.domain.model.CourtMaintenance;
import com.policourt.api.maintenance.domain.model.MaintenanceCreationResult;
import com.policourt.api.maintenance.presentation.response.CourtMaintenanceResponse;
import com.policourt.api.maintenance.presentation.response.MaintenanceCreationResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CourtMaintenancePresentationMapper {

    private final BookingPresentationMapper bookingPresentationMapper;

    public CourtMaintenanceResponse toResponse(CourtMaintenance maintenance) {
        if (maintenance == null) {
            return null;
        }
        return CourtMaintenanceResponse.builder()
                .uuid(maintenance.getUuid() != null ? maintenance.getUuid().toString() : null)
                .courtSlug(maintenance.getCourt() != null ? maintenance.getCourt().getSlug() : null)
                .title(maintenance.getTitle())
                .description(maintenance.getDescription())
                .startTime(maintenance.getStartTime())
                .endTime(maintenance.getEndTime())
                .status(maintenance.getStatus())
                .isActive(maintenance.getIsActive())
                .createdAt(maintenance.getCreatedAt())
                .updatedAt(maintenance.getUpdatedAt())
                .build();
    }

    public MaintenanceCreationResponse toCreationResponse(MaintenanceCreationResult result) {
        if (result == null) {
            return null;
        }
        List<BookingCancellationResponse> cancellations = result.getCancelledBookings() != null
            ? result.getCancelledBookings().stream()
                .map(this::toCancellationResponse)
                .toList()
            : List.of();
        return MaintenanceCreationResponse.builder()
                .maintenance(toResponse(result.getMaintenance()))
            .cancelledBookings(cancellations)
                .build();
    }

    private BookingCancellationResponse toCancellationResponse(BookingCancellationResult cancellationResult) {
        return bookingPresentationMapper.toCancellationResponse(cancellationResult);
    }
}
