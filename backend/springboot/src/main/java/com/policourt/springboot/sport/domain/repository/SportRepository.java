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
    /**
     * Guarda o actualiza un deporte en el repositorio.
     *
     * @param sport El deporte a guardar.
     * @return El deporte guardado.
     */
    Sport save(Sport sport);

    /**
     * Busca un deporte por su identificador único.
     *
     * @param id El UUID del deporte.
     * @return Un Optional con el deporte si existe.
     */
    Optional<Sport> findById(UUID id);

    /**
     * Busca un deporte por su slug (identificador amigable).
     *
     * @param slug El slug del deporte.
     * @return Un Optional con el deporte si existe.
     */
    Optional<Sport> findBySlug(String slug);

    /**
     * Recupera todos los deportes del sistema.
     *
     * @return Lista de todos los deportes.
     */
    List<Sport> findAll();

    /**
     * Verifica si existe un deporte con el nombre dado.
     *
     * @param name El nombre a verificar.
     * @return true si existe, false en caso contrario.
     */
    boolean existsByName(String name);

    /**
     * Elimina un deporte por su identificador.
     *
     * @param id El UUID del deporte a eliminar.
     */
    void deleteById(UUID id);

    /**
     * Elimina una entidad de deporte específica.
     *
     * @param sport El deporte a eliminar.
     */
    void delete(Sport sport);

    /**
     * Verifica si existe un deporte con el slug dado.
     *
     * @param slug El slug a verificar.
     * @return true si existe, false en caso contrario.
     */
    boolean existsBySlug(String slug);
} 