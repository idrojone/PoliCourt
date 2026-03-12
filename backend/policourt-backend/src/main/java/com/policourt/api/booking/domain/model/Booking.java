package com.policourt.api.booking.domain.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.policourt.api.booking.domain.enums.BookingStatusEnum;
import com.policourt.api.booking.domain.enums.BookingTypeEnum;
import com.policourt.api.court.domain.model.Court;
import com.policourt.api.sport.domain.model.Sport;
import com.policourt.api.user.domain.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    private Long id;
    private UUID uuid;
    private Court court;
    private User organizer;
    private Sport sport;
    private BookingTypeEnum type;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
    private BigDecimal totalPrice;
    private BookingStatusEnum status;
    private Boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
