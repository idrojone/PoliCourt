package com.policourt.api.auth.domain.model;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.policourt.api.user.domain.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshSession {
    private UUID id;
    private User user;
    private String deviceId;
    private UUID familyId;
    private String currentTokenHash;
    private Boolean revoked;
    private Integer sessionVersion;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
