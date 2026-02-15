package com.policourt.api.club.domain.model;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.sport.domain.model.Sport;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Club {
    private Long id;
    private String slug;
    private String name;
    private String description;
    private String imgUrl;
    private Sport sport;
    private GeneralStatus status;
    private Boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
