package com.policourt.api.booking.application.model;

import com.policourt.api.booking.domain.model.Booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCancellationResult {
    private Booking booking;
    private boolean refunded;
}