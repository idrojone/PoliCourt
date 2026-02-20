package com.policourt.api.auth.domain.repository;

import java.util.Optional;
import java.util.UUID;

import com.policourt.api.auth.domain.model.RefreshSession;

public interface RefreshSessionRepository {

    RefreshSession save(RefreshSession session);

    Optional<RefreshSession> findByFamilyId(UUID familyId);

    Optional<RefreshSession> findByCurrentTokenHash(String hash);

    void revokeByFamilyId(UUID familyId);
}
