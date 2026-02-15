package com.policourt.api.club.domain.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.policourt.api.shared.enums.GeneralStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubCriteria {
    private String name;
    private String imgUrl;
    private List<String> sports;
    private GeneralStatus status;
    private Boolean isActive;
    private int page;
    private int limit;
    private String sort;
}
