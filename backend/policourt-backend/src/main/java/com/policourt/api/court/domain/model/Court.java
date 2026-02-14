package com.policourt.api.court.domain.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.policourt.api.court.domain.enums.CourtSurfaceEnum;
import com.policourt.api.shared.enums.GeneralStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Court {
    private UUID id;
    private String slug;
    private String name;
    private String locationDetails;
    private String imgUrl;
    private BigDecimal priceH;
    private Integer capacity;
    private Boolean isIndoor;
    private CourtSurfaceEnum surface;
    private GeneralStatus status;
    private Boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
