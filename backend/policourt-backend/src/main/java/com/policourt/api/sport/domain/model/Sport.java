package com.policourt.api.sport.domain.model;

import java.time.OffsetDateTime;

import com.policourt.api.shared.enums.GeneralStatus;

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
public class Sport {
    private Long id;
    private String slug;
    private String name;
    private String description;
    private String imgUrl;
    private GeneralStatus status;
    private boolean isActive;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}