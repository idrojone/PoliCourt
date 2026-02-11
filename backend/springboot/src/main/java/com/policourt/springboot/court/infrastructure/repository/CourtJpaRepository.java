package com.policourt.springboot.court.infrastructure.repository;

import com.policourt.springboot.court.infrastructure.entity.CourtEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

/**
 * Repositorio JPA para la entidad CourtEntity.
 * Proporciona métodos para el acceso a datos de las pistas deportivas.
 */
@Repository
public interface CourtJpaRepository extends JpaRepository<CourtEntity, UUID>, JpaSpecificationExecutor<CourtEntity> {

    /**
     * Comprueba si existe una pista con el slug proporcionado.
     *
     * @param slug El identificador amigable de la pista.
     * @return true si existe, false en caso contrario.
     */
    boolean existsBySlug(String slug);

    /**
     * Busca una pista por su slug, cargando de forma ansiosa sus asignaciones deportivas.
     *
     * @param slug El identificador amigable de la pista.
     * @return Un Optional con la entidad encontrada.
     */
    @EntityGraph(
        attributePaths = { "sportAssignments", "sportAssignments.sport" }
    )
    Optional<CourtEntity> findBySlug(String slug);

    /**
     * Recupera todas las pistas cargando de forma ansiosa sus asignaciones deportivas.
     *
     * @return Lista de todas las entidades de pista.
     */
    @Override
    @NonNull
    @EntityGraph(
        attributePaths = { "sportAssignments", "sportAssignments.sport" }
    )
    List<CourtEntity> findAll();

    @NonNull
    @Override
    @EntityGraph(
        attributePaths = { "sportAssignments", "sportAssignments.sport" }
    )
    Page<CourtEntity> findAll(@Nullable Specification<CourtEntity> spec, @NonNull Pageable pageable);
}
