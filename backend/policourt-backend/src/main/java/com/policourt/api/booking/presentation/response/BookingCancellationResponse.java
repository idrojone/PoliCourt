package com.policourt.api.booking.presentation.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCancellationResponse {
    private BookingResponse booking;
    private boolean refunded;
}
