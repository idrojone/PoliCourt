package com.policourt.api.auth.infrastructure.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.policourt.api.auth.infrastructure.entity.RefreshSessionEntity;

@Repository
public interface RefreshSessionJpaRepository extends JpaRepository<RefreshSessionEntity, UUID> {

    Optional<RefreshSessionEntity> findByFamilyId(UUID familyId);

    Optional<RefreshSessionEntity> findByCurrentTokenHash(String hash);

    @Modifying
    @Query("UPDATE RefreshSessionEntity r SET r.revoked = true WHERE r.familyId = :familyId")
    void revokeByFamilyId(UUID familyId);

    @Modifying
    @Query("UPDATE RefreshSessionEntity r SET r.revoked = true WHERE r.user.id = :userId")
    void revokeByUserId(Long userId);
}
