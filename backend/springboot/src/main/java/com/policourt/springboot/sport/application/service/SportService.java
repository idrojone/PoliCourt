package com.policourt.springboot.sport.application.service;

import com.policourt.springboot.shared.utils.SlugGenerator;
import com.policourt.springboot.sport.application.mapper.SportDtoMapper;
import com.policourt.springboot.sport.domain.model.Sport;
import com.policourt.springboot.sport.domain.model.SportStatus;
import com.policourt.springboot.sport.domain.repository.SportRepository;
import com.policourt.springboot.sport.presentation.request.SportRequest;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Servicio para la gestión de deportes.
 * Proporciona métodos para crear, leer, actualizar y eliminar deportes.
 *
 * @author Jordi Valls
 * @version 1.0.0
 */
@Service
@RequiredArgsConstructor
public class SportService {

    private final SportRepository sportRepository;
    private final SlugGenerator slugGenerator;
    private final SportDtoMapper sportDtoMapper;

    /**
     * Crea un nuevo deporte en el sistema.
     *
     * @param request Datos de creación del deporte.
     * @return Deporte creado y persistido.
     * @throws IllegalArgumentException Si validaciones fallan (nombre vacío, slug duplicado).
     */
    @Transactional
    public Sport createSport(SportRequest request) {
        // 1. Validar campos obligatorios
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException(
                "El nombre del deporte es obligatorio."
            );
        }

        // 2. Generar o sanitizar Slug
        String slug = slugGenerator.generate(request.name());

        // 3. Validar unicidad del slug
        if (
            sportRepository.existsBySlug(slug)
        ) throw new IllegalArgumentException(
            "Ya existe un deporte con el slug: " + slug
        );

        Sport sport = sportDtoMapper.toDomain(request, slug);

        return sportRepository.save(sport);
    }

    /**
     * Recupera un deporte específico buscando por su identificador amigable (slug).
     *
     * @param slug El identificador único amigable del deporte.
     * @return El objeto de dominio {@link Sport} encontrado.
     * @throws IllegalArgumentException si no se encuentra ningún deporte con ese slug.
     */
    public Sport getSportBySlug(String slug) {
        return sportRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Sport not found with slug: " + slug
                )
            );
    }

    /**
     * Recupera la lista completa de deportes registrados en el sistema.
     *
     * @return Una lista de objetos {@link Sport}.
     */
    public List<Sport> getAllSports() {
        return sportRepository.findAll();
    }

    /**
     * Actualiza la información de un deporte existente.
     * Si el nombre cambia, se regenera el slug y se valida que no exista duplicado.
     *
     * @param slug    El identificador del deporte a modificar.
     * @param request El DTO con los nuevos datos del deporte.
     * @return El deporte actualizado y persistido.
     * @throws IllegalArgumentException si el deporte no existe o el nuevo nombre genera un slug duplicado.
     */
    @Transactional
    public Sport updateSport(String slug, SportRequest request) {
        // 1. Validar campos obligatorios
        if (request.name() == null || request.name().isBlank()) {
            throw new IllegalArgumentException(
                "El nombre del deporte es obligatorio."
            );
        }

        if (slug == null || slug.isBlank()) {
            throw new IllegalArgumentException(
                "El slug es obligatorio para identificar el deporte a actualizar."
            );
        }

        var sport = sportRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Deporte no encontrado con slug: " + slug
                )
            );

        // 2. Verificar si cambió el nombre para regenerar el slug
        if (!sport.getName().equals(request.name())) {
            if (sportRepository.existsByName(request.name())) {
                throw new IllegalArgumentException(
                    "El nombre del deporte '" + request.name() + "' ya existe."
                );
            }

            var newSlug = slugGenerator.generate(request.name());

            // Solo validamos unicidad si el slug resultante es diferente al actual
            if (!newSlug.equals(sport.getSlug())) {
                sport.setSlug(newSlug);
            }
            sport.setName(request.name());
        }

        // 3. Actualizar resto de campos
        sport.setDescription(request.description());
        sport.setImgUrl(request.imgUrl());

        if (request.status() != null) {
            sport.setStatus(request.status());
        }

        return sportRepository.save(sport);
    }

    /**
     * Elimina permanentemente un deporte del sistema.
     *
     * @param slug El identificador del deporte a eliminar.
     * @throws IllegalArgumentException si el deporte no existe.
     */
    @Transactional
    public void deleteSportBySlug(String slug) {
        var sport = sportRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Deporte con slug: " + slug + " no encontrado"
                )
            );
        sportRepository.delete(sport);
    }

    /**
     * Modifica el estado de publicación de un deporte (ej. de DRAFT a PUBLISHED).
     *
     * @param slug   El identificador del deporte.
     * @param status El nuevo estado a asignar.
     * @return El deporte con el estado actualizado.
     * @throws IllegalArgumentException si los parámetros son nulos o el deporte no existe.
     */
    @Transactional
    public Sport updateSportStatus(String slug, SportStatus status) {
        if (slug == null || slug.isBlank()) throw new IllegalArgumentException(
            "Slug no puede ser nulo o vacío"
        );

        if (status == null) throw new IllegalArgumentException(
            "Status no puede ser nulo"
        );

        var sport = sportRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Deporte con slug: " + slug + " no encontrado"
                )
            );

        sport.setStatus(status);
        return sportRepository.save(sport);
    }

    /**
     * Alterna el estado de activación (borrado lógico) de un deporte.
     * Si estaba activo pasa a inactivo y viceversa.
     *
     * @param slug El identificador del deporte.
     * @return El deporte con el flag de activo actualizado.
     * @throws IllegalArgumentException si el deporte no existe.
     */
    @Transactional
    public Sport toggleSportActive(String slug) {
        var sport = sportRepository
            .findBySlug(slug)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Deporte con slug: " + slug + " no encontrado"
                )
            );
        sport.setActive(!sport.isActive());
        return sportRepository.save(sport);
    }
}
