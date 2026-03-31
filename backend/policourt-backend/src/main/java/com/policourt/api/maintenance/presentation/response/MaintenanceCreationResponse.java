package com.policourt.api.maintenance.presentation.response;

import java.util.List;

import com.policourt.api.booking.presentation.response.BookingCancellationResponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceCreationResponse {
    private CourtMaintenanceResponse maintenance;
    private List<BookingCancellationResponse> cancelledBookings;
}
