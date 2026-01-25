package com.policourt.springboot.court.infrastructure.repository;

import com.policourt.springboot.court.infrastructure.entity.CourtEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourtJpaRepository extends JpaRepository<CourtEntity, UUID> {
    boolean existsBySlug(String slug);

    @EntityGraph(
        attributePaths = { "sportAssignments", "sportAssignments.sport" }
    )
    Optional<CourtEntity> findBySlug(String slug);

    @Override
    @EntityGraph(
        attributePaths = { "sportAssignments", "sportAssignments.sport" }
    )
    List<CourtEntity> findAll();
}
