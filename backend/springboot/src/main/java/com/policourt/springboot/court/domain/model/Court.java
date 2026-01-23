package com.policourt.springboot.court.domain.model;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import com.policourt.springboot.courtsport.domain.model.CourtSport;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Court {
    private UUID id;
    private String slug;
    private String name;
    private String locationDetails;
    private String imgUrl;
    private Double priceH;
    private Integer capacity;
    private Boolean isIndoor;
    private CourtSurface surface;
    private CourtStatus status;
    private boolean isActive;
    private List<CourtSport> sportCourts;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
