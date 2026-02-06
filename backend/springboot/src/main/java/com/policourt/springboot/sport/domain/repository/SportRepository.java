package com.policourt.springboot.sport.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.model.SportStatus;

/**
 * Repositorio para la gestión de deportes.
 * Define las operaciones CRUD y consultas específicas para la entidad Sport.
 * 
 * @author Jordi Valls 
 * @version 1.0.0
 */
public interface SportRepository {

    Optional<Sport> findById(UUID id);

    Sport save(Sport sport);

    List<Sport> findAll();

    void deleteById(UUID id);

    void delete(Sport sport);

    Optional<Sport> findBySlug(String slug);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    /**
     * Búsqueda paginada y filtrada personalizada (implementada por el adaptador).
     *
     * @param q Texto de búsqueda
     * @param status Filtro por estado
     * @param isActive Filtro por activo
     * @param pageable Paginación y orden
     * @return Página de {@link Sport}
     */
    org.springframework.data.domain.Page<Sport> findAllByFilters(String q, java.util.Collection<SportStatus> statuses, Boolean isActive, org.springframework.data.domain.Pageable pageable);
} 