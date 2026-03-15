package com.policourt.api.auth.infrastructure.adapter;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.policourt.api.auth.domain.model.RefreshSession;
import com.policourt.api.auth.domain.repository.RefreshSessionRepository;
import com.policourt.api.auth.infrastructure.mapper.RefreshSessionMapper;
import com.policourt.api.auth.infrastructure.repository.RefreshSessionJpaRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class RefreshSessionRepositoryAdapter implements RefreshSessionRepository {

    private final RefreshSessionJpaRepository jpaRepository;
    private final RefreshSessionMapper mapper;

    @Override
    public RefreshSession save(RefreshSession session) {
        var entity = mapper.toEntity(session);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<RefreshSession> findByFamilyId(UUID familyId) {
        return jpaRepository.findByFamilyId(familyId)
                .map(mapper::toDomain);
    }

    @Override
    public Optional<RefreshSession> findByCurrentTokenHash(String hash) {
        return jpaRepository.findByCurrentTokenHash(hash)
                .map(mapper::toDomain);
    }

    @Override
    public void revokeByFamilyId(UUID familyId) {
        jpaRepository.revokeByFamilyId(familyId);
    }

    @Override
    public void revokeByUserId(Long userId) {
        jpaRepository.revokeByUserId(userId);
    }
}
