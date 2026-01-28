package com.policourt.springboot.court.domain.model;

import com.policourt.springboot.court.domain.enums.CourtStatus;
import com.policourt.springboot.court.domain.enums.CourtSurface;
import com.policourt.springboot.courtsport.domain.model.CourtSport;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
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
    private CourtSurface surface;

    @Builder.Default
    private CourtStatus status = CourtStatus.PUBLISHED;

    @Builder.Default
    private boolean isActive = true;

    private List<CourtSport> sportCourts;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
