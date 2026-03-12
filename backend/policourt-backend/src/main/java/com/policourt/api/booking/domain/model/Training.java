package com.policourt.api.booking.domain.model;

import java.math.BigDecimal;

import com.policourt.api.club.domain.model.Club;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Training extends Booking {
    private Club club;
    private BigDecimal attendeePrice;
}
