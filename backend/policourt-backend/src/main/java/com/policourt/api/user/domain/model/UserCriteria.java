package com.policourt.api.user.domain.model;

import java.util.Collection;

import com.policourt.api.shared.enums.GeneralStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCriteria {
    private String q;
    private Collection<GeneralStatus> status;
    private Boolean isActive;
    private int page;
    private int limit;
    private String sort;
}
