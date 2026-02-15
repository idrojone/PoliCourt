package com.policourt.api.court.domain.model;

import java.math.BigDecimal;
import java.util.List;

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
public class CourtCriteria {
    private String q;
    private String name;
    private String locationDetails;
    private BigDecimal priceMin;
    private BigDecimal priceMax;
    private Integer capacityMin;
    private Integer capacityMax;
    private Boolean isIndoor;
    private List<CourtSurfaceEnum> surfaces;
    private List<GeneralStatus> statuses;
    private List<String> sports;
    private Boolean isActive;
    private int page;
    private int limit;
    private String sort;
}
