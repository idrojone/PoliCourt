package com.policourt.springboot.sport.infrastructure.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.policourt.springboot.sport.infrastructure.entity.SportEntity;

/**
 * Repositorio JPA para la entidad SportEntity.
 * Proporciona acceso a datos utilizando Spring Data JPA y soporte para consultas dinámicas mediante Specifications.
 * 
 * @author Jordi Valls
 * @version 1.0.0
 */
public interface SportJpaRepository extends JpaRepository<SportEntity, UUID>, JpaSpecificationExecutor<SportEntity> {
    
    /**
     * Busca una entidad de deporte por su slug.
     *
     * @param slug El slug del deporte.
     * @return Un Optional con la entidad si se encuentra.
     */
    Optional<SportEntity> findBySlug(String slug);

    /**
     * Comprueba si existe un deporte con el slug especificado.
     *
     * @param slug El slug a comprobar.
     * @return true si existe, false en caso contrario.
     */
    boolean existsBySlug(String slug);

    /**
     * Comprueba si existe un deporte con el nombre especificado.
     *
     * @param name El nombre a comprobar.
     * @return true si existe, false en caso contrario.
     */
    boolean existsByName(String name);
}