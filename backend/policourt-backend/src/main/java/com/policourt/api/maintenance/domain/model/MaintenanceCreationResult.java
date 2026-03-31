package com.policourt.api.maintenance.domain.model;

import java.util.List;

import com.policourt.api.booking.application.model.BookingCancellationResult;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceCreationResult {
    private CourtMaintenance maintenance;
    private List<BookingCancellationResult> cancelledBookings;
}
