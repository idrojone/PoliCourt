package com.policourt.springboot.sport.domain.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.policourt.springboot.sport.domain.model.Sport;

/**
 * Repositorio para la gestión de deportes.
 * Define las operaciones CRUD y consultas específicas para la entidad Sport.
 * 
 * @author Jordi Valls 
 * @version 1.0.0
 */
public interface SportRepository {
    Sport save(Sport sport);
    Optional<Sport> findById(UUID id);
    Optional<Sport> findBySlug(String slug);
    List<Sport> findAll();
    boolean existsByName(String name);
    void deleteById(UUID id);
    void delete(Sport sport);
    boolean existsBySlug(String slug);
} 