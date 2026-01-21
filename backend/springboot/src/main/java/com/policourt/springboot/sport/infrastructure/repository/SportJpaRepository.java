package com.policourt.springboot.sport.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

import com.policourt.springboot.sport.infrastructure.entity.SportEntity;

/**
 * Repositorio JPA para la entidad SportEntity.
 * Proporciona métodos para realizar operaciones CRUD en la tabla SPORTS.
 * 
 * @author Jordi Valls
 * @version 1.0.0
 * 
 * @see SportEntity
*/
public interface SportJpaRepository extends JpaRepository<SportEntity, UUID> {
    Optional<SportEntity> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsByName(String name);
}
